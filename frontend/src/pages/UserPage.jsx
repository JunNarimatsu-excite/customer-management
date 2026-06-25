import { useEffect, useState } from 'react'

const USER_URL = 'http://20.196.152.70:30081/api/users'

function UserPage({ onUnauthorized }) {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(USER_URL, {
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (response.status === 403) {
        setError('管理者権限が必要です')
        return
      }

      if (!response.ok) throw new Error('ユーザー一覧の取得に失敗しました')

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'USER',
    })
    setEditingId(null)
    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!form.id.trim()) {
      setError('IDは必須です')
      return
    }

    if (!form.name.trim()) {
      setError('名前は必須です')
      return
    }

    if (!form.email.trim()) {
      setError('メールは必須です')
      return
    }

    if (!form.role.trim()) {
      setError('ロールは必須です')
      return
    }

    if (!editingId && !form.password.trim()) {
      setError('新規登録時はパスワードが必須です')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${USER_URL}/${editingId}` : USER_URL

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (response.status === 403) {
        setError('管理者権限が必要です')
        return
      }

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(errorBody || '保存に失敗しました')
      }

      const result = await response.json()

      if (editingId) {
        setUsers(users.map((user) => (user.id === editingId ? result : user)))
        setMessage('ユーザーを更新しました')
      } else {
        setUsers([...users, result])
        setMessage('ユーザーを登録しました')
      }

      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(user) {
    setEditingId(user.id)
    setForm({
      id: user.id,
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      role: user.role ?? 'USER',
    })
    setMessage('編集モードです。パスワードは変更する場合のみ入力してください。')
    setError('')
  }

  async function handleDelete(id) {
    if (!window.confirm('このユーザーを削除しますか？')) return

    setMessage('')
    setError('')

    try {
      const response = await fetch(`${USER_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (response.status === 403) {
        setError('管理者権限が必要です')
        return
      }

      if (!response.ok) throw new Error('削除に失敗しました')

      setUsers(users.filter((user) => user.id !== id))
      setMessage('ユーザーを削除しました')

      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <header>
        <h1>ユーザー管理</h1>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>{editingId ? 'ユーザー情報を編集' : 'ユーザー登録'}</h2>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <label>
            ID<span>（必須）</span>
            <input
              type="text"
              value={form.id}
              disabled={editingId !== null}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="ログインIDを入力してください"
            />
          </label>

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
            メール<span>（必須）</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="メールアドレスを入力してください"
            />
          </label>

          <label>
            ロール<span>（必須）</span>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <label>
            パスワード{editingId ? '（変更する場合のみ）' : '（必須）'}
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="パスワードを入力してください"
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="primary">{editingId ? '更新' : '登録'}</button>

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
          <h2>ユーザー一覧</h2>
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
                <th>ロール</th>
                <th>操作</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">ユーザーが存在しません</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role ?? '-'}</td>
                    <td className="actions">
                      <button type="button" className="primary" onClick={() => handleEdit(user)}>
                        編集
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDelete(user.id)}
                      >
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
    </>
  )
}

export default UserPage