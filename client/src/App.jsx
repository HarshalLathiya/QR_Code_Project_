import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for better performance
const Register = React.lazy(() => import('./pages/Register'))
const Login = React.lazy(() => import('./pages/Login'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/register" />}
        >
          <Route
            index
            element={isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<Dashboard />}
          />
          {isAdmin && (
            <Route
              path="admin"
              element={<AdminDashboard />}
            />
          )}
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App