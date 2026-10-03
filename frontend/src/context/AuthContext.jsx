import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.me()
      setUser(data)
      return data
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
