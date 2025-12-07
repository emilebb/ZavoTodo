/**
 * ============================================
 * ZAVO - Firebase Product Service
 * ============================================
 * 
 * CRUD completo de productos con Firebase
 * Incluye: crear, leer, actualizar, eliminar, subir imágenes
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '../../lib/firebase'
import { Product, CreateProductData, ProductCategory, COLLECTIONS } from '../../types/firebase'

// ============================================
// TIPOS
// ============================================

export interface ProductFilters {
  category?: ProductCategory
  business_id?: string
  is_available?: boolean
  min_price?: number
  max_price?: number
}

export interface PaginationOptions {
  limit?: number
  lastDoc?: DocumentSnapshot
}

export interface ProductsResult {
  products: Product[]
  lastDoc: DocumentSnapshot | null
  hasMore: boolean
}

// ============================================
// CREAR PRODUCTO
// ============================================

/**
 * Crea un nuevo producto
 * @param data - Datos del producto
 * @param imageFile - Archivo de imagen (opcional)
 */
export async function createProduct(
  data: CreateProductData,
  imageFile?: File
): Promise<{ product: Product | null; error: string | null }> {
  try {
    let image_url = data.image_url

    // Subir imagen si se proporciona
    if (imageFile) {
      const uploadResult = await uploadProductImage(imageFile)
      if (uploadResult.url) {
        image_url = uploadResult.url
      }
    }

    // Crear documento en Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
      ...data,
      image_url,
      created_at: serverTimestamp(),
      total_sold: 0,
    })

    // Obtener el producto creado
    const product: Product = {
      id: docRef.id,
      ...data,
      image_url,
      created_at: new Date().toISOString(),
      total_sold: 0,
    }

    return { product, error: null }
  } catch (error: any) {
    console.error('Error creando producto:', error)
    return { product: null, error: 'Error al crear el producto' }
  }
}

// ============================================
// LEER PRODUCTOS
// ============================================

/**
 * Obtiene un producto por ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product
    }

    return null
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return null
  }
}

/**
 * Obtiene lista de productos con filtros y paginación
 */
export async function getProducts(
  filters?: ProductFilters,
  pagination?: PaginationOptions
): Promise<ProductsResult> {
  try {
    const constraints: QueryConstraint[] = []

    // Aplicar filtros
    if (filters?.category) {
      constraints.push(where('category', '==', filters.category))
    }
    if (filters?.business_id) {
      constraints.push(where('business_id', '==', filters.business_id))
    }
    if (filters?.is_available !== undefined) {
      constraints.push(where('is_available', '==', filters.is_available))
    }

    // Ordenar por fecha de creación
    constraints.push(orderBy('created_at', 'desc'))

    // Paginación
    const pageLimit = pagination?.limit || 20
    constraints.push(limit(pageLimit + 1)) // +1 para saber si hay más

    if (pagination?.lastDoc) {
      constraints.push(startAfter(pagination.lastDoc))
    }

    // Ejecutar query
    const q = query(collection(db, COLLECTIONS.PRODUCTS), ...constraints)
    const snapshot = await getDocs(q)

    const products: Product[] = []
    let lastDoc: DocumentSnapshot | null = null

    snapshot.docs.forEach((doc, index) => {
      if (index < pageLimit) {
        products.push({
          id: doc.id,
          ...doc.data(),
        } as Product)
        lastDoc = doc
      }
    })

    return {
      products,
      lastDoc,
      hasMore: snapshot.docs.length > pageLimit,
    }
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return { products: [], lastDoc: null, hasMore: false }
  }
}

/**
 * Obtiene productos disponibles (para clientes)
 */
export async function getAvailableProducts(
  pagination?: PaginationOptions
): Promise<ProductsResult> {
  return getProducts({ is_available: true }, pagination)
}

/**
 * Obtiene productos por negocio
 */
export async function getProductsByBusiness(
  businessId: string,
  pagination?: PaginationOptions
): Promise<ProductsResult> {
  return getProducts({ business_id: businessId }, pagination)
}

// ============================================
// ACTUALIZAR PRODUCTO
// ============================================

/**
 * Actualiza un producto existente
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>,
  newImageFile?: File
): Promise<{ error: string | null }> {
  try {
    let updateData = { ...data }

    // Subir nueva imagen si se proporciona
    if (newImageFile) {
      const uploadResult = await uploadProductImage(newImageFile)
      if (uploadResult.url) {
        updateData.image_url = uploadResult.url
      }
    }

    await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
      ...updateData,
      updated_at: serverTimestamp(),
    })

    return { error: null }
  } catch (error: any) {
    console.error('Error actualizando producto:', error)
    return { error: 'Error al actualizar el producto' }
  }
}

/**
 * Actualiza el stock de un producto
 */
export async function updateProductStock(
  id: string,
  newStock: number
): Promise<{ error: string | null }> {
  return updateProduct(id, { 
    stock: newStock,
    is_available: newStock > 0,
  })
}

/**
 * Incrementa el contador de ventas
 */
export async function incrementProductSales(
  id: string,
  quantity: number = 1
): Promise<{ error: string | null }> {
  try {
    const product = await getProduct(id)
    if (!product) {
      return { error: 'Producto no encontrado' }
    }

    await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
      total_sold: (product.total_sold || 0) + quantity,
      stock: Math.max(0, product.stock - quantity),
      updated_at: serverTimestamp(),
    })

    return { error: null }
  } catch (error: any) {
    console.error('Error incrementando ventas:', error)
    return { error: 'Error al actualizar ventas' }
  }
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================

/**
 * Elimina un producto
 */
export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  try {
    // Obtener producto para eliminar imagen
    const product = await getProduct(id)
    
    // Eliminar imagen de Storage si existe
    if (product?.image_url && product.image_url.includes('firebase')) {
      try {
        const imageRef = ref(storage, product.image_url)
        await deleteObject(imageRef)
      } catch (e) {
        console.warn('No se pudo eliminar la imagen:', e)
      }
    }

    // Eliminar documento
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id))

    return { error: null }
  } catch (error: any) {
    console.error('Error eliminando producto:', error)
    return { error: 'Error al eliminar el producto' }
  }
}

// ============================================
// IMÁGENES
// ============================================

/**
 * Sube una imagen de producto a Firebase Storage
 */
export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'El archivo debe ser una imagen' }
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'La imagen no debe superar 5MB' }
    }

    // Generar nombre único
    const timestamp = Date.now()
    const fileName = `products/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)

    // Subir archivo
    await uploadBytes(storageRef, file)

    // Obtener URL de descarga
    const url = await getDownloadURL(storageRef)

    return { url, error: null }
  } catch (error: any) {
    console.error('Error subiendo imagen:', error)
    return { url: null, error: 'Error al subir la imagen' }
  }
}

// ============================================
// BÚSQUEDA
// ============================================

/**
 * Busca productos por nombre (búsqueda simple)
 * Nota: Para búsqueda avanzada, considera usar Algolia o ElasticSearch
 */
export async function searchProducts(
  searchTerm: string,
  limitResults: number = 10
): Promise<Product[]> {
  try {
    // Firestore no soporta búsqueda de texto completo
    // Esta es una búsqueda simple por prefijo
    const searchLower = searchTerm.toLowerCase()
    
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS),
      where('is_available', '==', true),
      orderBy('name'),
      limit(limitResults)
    )

    const snapshot = await getDocs(q)
    
    // Filtrar en cliente (no ideal para grandes datasets)
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
  } catch (error) {
    console.error('Error buscando productos:', error)
    return []
  }
}
