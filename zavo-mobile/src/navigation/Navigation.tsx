import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuthStore } from '../store/authStore'
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import LoadingScreen from '../screens/LoadingScreen'

const RootStack = createStackNavigator()

export default function Navigation() {
  const { user, initialized, loading } = useAuthStore()

  if (!initialized || loading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
