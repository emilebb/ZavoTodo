/**
 * ============================================
 * ZAVO - Firebase Auth Service
 * ============================================
 * 
 * Servicio completo de autenticación con Firebase
 * Incluye: registro, login, logout, recuperación de contraseña
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseAuthUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { FirebaseUser, UserRole, COLLECTIONS } from '../../types/firebase'

// ============================================
// TIPOS
// ============================================

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  role?: UserRole
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  user: FirebaseUser | null
  error: string | null
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

/**
 * Registra un nuevo usuario
 * 1. Crea cuenta en Firebase Auth
 * 2. Crea documento en Firestore
 */
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    // 1. Crear usuario en Firebase Auth
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    // 2. Actualizar perfil con nombre
    await updateProfile(credential.user, {
      displayName: data.name,
    })

    // 3. Crear documento en Firestore
    const userData: Omit<FirebaseUser, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'cliente',
      is_active: true,
      created_at: serverTimestamp(),
    }

    await setDoc(
      doc(db, COLLECTIONS.USERS, credential.user.uid),
      userData
    )

    // 4. Retornar usuario completo
    const user: FirebaseUser = {
      id: credential.user.uid,
      ...userData,
      created_at: new Date().toISOString(),
    }

    return { user, error: null }
  } catch (error: any) {
    console.error('Error en registro:', error)
    return { 
      user: null, 
      error: getAuthErrorMessage(error.code) 
    }
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function loginUser(data: LoginData): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    // Obtener datos del usuario de Firestore
    const user = await getUserFromFirestore(credential.user.uid)

    // Actualizar último login
    if (user) {
      await updateDoc(doc(db, COLLECTIONS.USERS, user.id), {
        last_login: serverTimestamp(),
      })
    }

    return { user, error: null }
  } catch (error: any) {
    console.error('Error en login:', error)
    return { 
      user: null, 
      error: getAuthErrorMessage(error.code) 
    }
  }
}

/**
 * Inicia sesión con Google
 */
export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)

    // Verificar si el usuario ya existe en Firestore
    let user = await getUserFromFirestore(credential.user.uid)

    // Si no existe, crear documento
    if (!user) {
      const userData: Omit<FirebaseUser, 'id'> = {
        name: credential.user.displayName || 'Usuario',
        email: credential.user.email || '',
        avatar_url: credential.user.photoURL || undefined,
        role: 'cliente',
        is_active: true,
        created_at: serverTimestamp(),
      }

      await setDoc(
        doc(db, COLLECTIONS.USERS, credential.user.uid),
        userData
      )

      user = {
        id: credential.user.uid,
        ...userData,
        created_at: new Date().toISOString(),
      }
    }

    return { user, error: null }
  } catch (error: any) {
    console.error('Error en login con Google:', error)
    return { 
      user: null, 
      error: getAuthErrorMessage(error.code) 
    }
  }
}

/**
 * Cierra sesión
 */
export async function logoutUser(): Promise<{ error: string | null }> {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    console.error('Error en logout:', error)
    return { error: 'Error al cerrar sesión' }
  }
}

/**
 * Envía email de recuperación de contraseña
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    console.error('Error en reset password:', error)
    return { error: getAuthErrorMessage(error.code) }
  }
}

// ============================================
// FUNCIONES DE USUARIO
// ============================================

/**
 * Obtiene los datos del usuario de Firestore
 */
export async function getUserFromFirestore(uid: string): Promise<FirebaseUser | null> {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirebaseUser
    }

    return null
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return null
  }
}

/**
 * Actualiza los datos del usuario
 */
export async function updateUser(
  uid: string, 
  data: Partial<FirebaseUser>
): Promise<{ error: string | null }> {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...data,
      updated_at: serverTimestamp(),
    })
    return { error: null }
  } catch (error: any) {
    console.error('Error actualizando usuario:', error)
    return { error: 'Error al actualizar perfil' }
  }
}

/**
 * Escucha cambios en el estado de autenticación
 */
export function onAuthChange(
  callback: (user: FirebaseAuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Obtiene el usuario actual
 */
export function getCurrentAuthUser(): FirebaseAuthUser | null {
  return auth.currentUser
}

// ============================================
// HELPERS
// ============================================

/**
 * Convierte códigos de error de Firebase a mensajes en español
 */
function getAuthErrorMessage(code: string): string {
  const errors: Record<string, string> = {
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/popup-closed-by-user': 'Inicio de sesión cancelado',
    'auth/cancelled-popup-request': 'Operación cancelada',
  }

  return errors[code] || 'Error de autenticación. Intenta de nuevo'
}
