import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>ZAVO</Text>
        <Text style={styles.subtitle}>Rescata comida, salva el planeta</Text>
      </View>
      <ActivityIndicator size="large" color="#22c55e" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
})
