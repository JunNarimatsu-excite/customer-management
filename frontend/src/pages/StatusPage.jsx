import { useEffect, useState } from 'react'

const STATUS_URL = 'http://20.196.152.70:30081/api/statuses'

function StatusPage({ onUnauthorized }) {
  const [statuses, setStatuses] = useState([])
  const [form, setForm] = useState({ statusCode: '', statusName: '' })
  const [editingCode, setEditingCode] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadStatuses()
  }, [])

  async function loadStatuses() {
    setError('')

    const response = await fetch(STATUS_URL, {
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

    const data = await response.json()
    setStatuses(data)
  }

  function resetForm() {
    setForm({ statusCode: '', statusName: '' })
    setEditingCode(null)
    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!form.statusCode.trim()) {
      setError('ステータスコードは必須です')
      return
    }

    if (!form.statusName.trim()) {
      setError('ステータス名は必須です')
      return
    }

    const method = editingCode ? 'PUT' : 'POST'
    const url = editingCode ? `${STATUS_URL}/${editingCode}` : STATUS_URL

    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
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
      setError('保存に失敗しました')
      return
    }

    const result = await response.json()

    if (editingCode) {
      setStatuses(statuses.map((s) => (s.statusCode === editingCode ? result : s)))
      setMessage('ステータスを更新しました')
    } else {
      setStatuses([...statuses, result])
      setMessage('ステータスを登録しました')
    }

    resetForm()
  }

  function handleEdit(status) {
    setEditingCode(status.statusCode)
    setForm({
      statusCode: status.statusCode,
      statusName: status.statusName,
    })
    setMessage('編集モードです')
    setError('')
  }

  async function handleDelete(statusCode) {
    if (!window.confirm('このステータスを削除しますか？')) return

    const response = await fetch(`${STATUS_URL}/${statusCode}`, {
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

    if (!response.ok) {
      setError('削除に失敗しました')
      return
    }

    setStatuses(statuses.filter((s) => s.statusCode !== statusCode))
    setMessage('ステータスを削除しました')

    if (editingCode === statusCode) {
      resetForm()
    }
  }

  return (
    <>
      <header>
        <h1>ステータス管理</h1>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>{editingCode ? 'ステータス編集' : 'ステータス登録'}</h2>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <label>
            ステータスコード
            <input
              value={form.statusCode}
              disabled={editingCode !== null}
              onChange={(e) => setForm({ ...form, statusCode: e.target.value })}
              placeholder="例：ST05"
            />
          </label>

          <label>
            ステータス名
            <input
              value={form.statusName}
              onChange={(e) => setForm({ ...form, statusName: e.target.value })}
              placeholder="例：保留"
            />
          </label>

          <div className="form-actions">
            <button type="submit">{editingCode ? '更新' : '登録'}</button>

            {editingCode && (
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
          <h2>ステータス一覧</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>ステータスコード</th>
              <th>ステータス名</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            {statuses.map((status) => (
              <tr key={status.statusCode}>
                <td>{status.statusCode}</td>
                <td>{status.statusName}</td>
                <td className="actions">
                  <button type="button" onClick={() => handleEdit(status)}>
                    編集
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => handleDelete(status.statusCode)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default StatusPage