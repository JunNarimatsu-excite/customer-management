import StatusPage from './pages/StatusPage'
import UserPage from './pages/UserPage'
import DashboardPage from './pages/DashboardPage'
import { useEffect, useState } from 'react'
import './App.css'
import LoginScreen from './components/LoginScreen'
import Layout from './components/Layout'
import CustomerPage from './pages/CustomerPage'
import CustomerFormPage from './pages/CustomerFormPage'
import AuditLogPage from './pages/AuditLogPage'

const LOGIN_URL = 'http://20.196.152.70:30081/api/login'
const ME_URL = 'http://20.196.152.70:30081/api/me'
const LOGOUT_URL = 'http://20.196.152.70:30081/api/logout'

function App() {
  const [loginUser, setLoginUser] = useState(null)
  const [checkingLogin, setCheckingLogin] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [customerMessage, setCustomerMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkLogin()
  }, [])

  async function checkLogin() {
    try {
      const response = await fetch(ME_URL, {
        credentials: 'include',
      })

      const data = await response.json()

      if (data.login) {
        setLoginUser(data)
      } else {
        setLoginUser(null)
      }
    } catch (err) {
      setLoginUser(null)
    } finally {
      setCheckingLogin(false)
    }
  }

  async function handleLogin(id, password) {
    setError('')

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'ログインに失敗しました')
        return
      }

      setLoginUser({
        login: true,
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    } catch (err) {
      setError('ログイン処理でエラーが発生しました')
    }
  }

  async function handleLogout() {
    await fetch(LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
    })

    setLoginUser(null)
    setSelectedMenu('dashboard')
    setEditingCustomerId(null)
    setCustomerMessage('')
  }

  function handleUnauthorized() {
    setLoginUser(null)
    setError('ログインしてください')
  }

  function openCustomerCreate() {
    setEditingCustomerId(null)
    setCustomerMessage('')
    setSelectedMenu('customerForm')
  }

  function openCustomerEdit(customerId) {
    setEditingCustomerId(customerId)
    setCustomerMessage('')
    setSelectedMenu('customerForm')
  }

  function completeCustomerForm(message) {
    setCustomerMessage(message)
    setEditingCustomerId(null)
    setSelectedMenu('customers')
  }

  function backToCustomers() {
    setEditingCustomerId(null)
    setSelectedMenu('customers')
  }

  if (checkingLogin) {
    return <div className="container">ログイン状態を確認中...</div>
  }

  if (!loginUser) {
    return <LoginScreen onLogin={handleLogin} error={error} />
  }

  return (
    <Layout
      loginUser={loginUser}
      selectedMenu={selectedMenu}
      setSelectedMenu={setSelectedMenu}
      onLogout={handleLogout}
    >
      {selectedMenu === 'dashboard' && (
        <DashboardPage
          loginUser={loginUser}
          onUnauthorized={handleUnauthorized}
        />
      )}

      {selectedMenu === 'customers' && (
        <CustomerPage
          onUnauthorized={handleUnauthorized}
          onCreate={openCustomerCreate}
          onEdit={openCustomerEdit}
          message={customerMessage}
          clearMessage={() => setCustomerMessage('')}
        />
      )}

      {selectedMenu === 'customerForm' && (
        <CustomerFormPage
          customerId={editingCustomerId}
          onUnauthorized={handleUnauthorized}
          onCompleted={completeCustomerForm}
          onCancel={backToCustomers}
        />
      )}

      {selectedMenu === 'users' && (
        <UserPage onUnauthorized={handleUnauthorized} />
      )}

      {selectedMenu === 'statuses' && (
        <StatusPage onUnauthorized={handleUnauthorized} />
      )}

      {selectedMenu === 'auditLogs' && (
        <AuditLogPage
          onUnauthorized={handleUnauthorized}
        />
      )}
    </Layout>
  )
}

export default App