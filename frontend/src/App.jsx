import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/customers'
const STATUS_URL = 'http://localhost:8080/api/statuses'

function App() {
  const [customers, setCustomers] = useState([])
  const [statuses, setStatuses] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', statusCode: 'ST01' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCustomers()
    loadStatuses()
  }, [])

  async function loadCustomers() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('顧客一覧の取得に失敗しました')
      const data = await response.json()
      setCustomers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadStatuses() {
    try {
      const response = await fetch(STATUS_URL)
      if (!response.ok) throw new Error('ステータス一覧の取得に失敗しました')
      const data = await response.json()
      setStatuses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  function resetForm() {
    setForm({ name: '', email: '', phone: '', statusCode: 'ST01' })
    setEditingId(null)
    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.name.trim()) {
      setError('名前は必須です')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${API_URL}/${editingId}` : API_URL
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(errorBody || '保存に失敗しました')
      }

      const result = await response.json()
      setMessage(editingId ? '顧客情報を更新しました' : '顧客を登録しました')
      if (editingId) {
        setCustomers(customers.map((item) => (item.id === editingId ? result : item)))
      } else {
        setCustomers([...customers, result])
      }
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(customer) {
    setEditingId(customer.id)
    setForm({
      name: customer.name ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      statusCode: customer.statusCode ?? 'ST01',
    })
    setMessage('編集モードです')
    setError('')
  }

  async function handleDelete(id) {
    if (!window.confirm('この顧客を削除しますか？')) return
    setError('')
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('削除に失敗しました')
      setCustomers(customers.filter((item) => item.id !== id))
      setMessage('顧客を削除しました')
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Customer Management System</h1>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>{editingId ? '顧客情報を編集' : '顧客登録'}</h2>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <label>
            名前<span>（必須）</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="名前を入力してください"
            />
          </label>
          <label>
            メール
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="メールアドレスを入力してください"
            />
          </label>
          <label>
            電話番号
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="電話番号を入力してください"
            />
          </label>
          <label>
            ステータス
            <select
              value={form.statusCode}
              onChange={(e) => setForm({ ...form, statusCode: e.target.value })}
            >
              {statuses.length === 0 ? (
                <option value="ST01">読み込み中...</option>
              ) : (
                statuses.map((status) => (
                  <option key={status.statusCode} value={status.statusCode}>
                    {status.statusName}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">{editingId ? '更新' : '登録'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                キャンセル
              </button>
            )}
          </div>
        </form>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>顧客一覧</h2>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>名前</th>
                <th>メール</th>
                <th>電話番号</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6">顧客が存在しません</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email ?? '-'}</td>
                    <td>{customer.phone ?? '-'}</td>
                    <td>{customer.statusName ?? '-'}</td>
                    <td className="actions">
                      <button type="button" onClick={() => handleEdit(customer)}>
                        編集
                      </button>
                      <button type="button" className="secondary" onClick={() => handleDelete(customer.id)}>
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      <footer>
        <small>バックエンド API: {API_URL}</small>
      </footer>
    </div>
  )
}

export default App
