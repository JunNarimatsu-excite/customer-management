import { useEffect, useState } from 'react'

const API_URL = 'http://20.196.152.70:30081/api/customers'
const STATUS_URL = 'http://20.196.152.70:30081/api/customers/statuses'

function CustomerPage({ onUnauthorized, onCreate, onEdit, message, clearMessage }) {
  const [customers, setCustomers] = useState([])
  const [statuses, setStatuses] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState({ name: '', email: '', statusCode: '' })
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sort, setSort] = useState('id')
  const [direction, setDirection] = useState('asc')

  useEffect(() => {
    loadCustomers()
  }, [page, sort, direction])

  useEffect(() => {
    loadStatuses()
  }, [])

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      clearMessage()
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  async function loadCustomers() {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()

      params.append('page', page)
      params.append('size', 10)
      params.append('sort', sort)
      params.append('direction', direction)

      if (search.name.trim()) {
        params.append('name', search.name)
      }

      if (search.email.trim()) {
        params.append('email', search.email)
      }

      if (search.statusCode.trim()) {
        params.append('statusCode', search.statusCode)
      }

      const response = await fetch(`${API_URL}/page?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        throw new Error('顧客一覧の取得に失敗しました')
      }

      const data = await response.json()

      setCustomers(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadStatuses() {
    try {
      const response = await fetch(STATUS_URL, {
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        throw new Error('ステータス一覧の取得に失敗しました')
      }

      const data = await response.json()
      setStatuses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('この顧客を削除しますか？')) return
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }

      setCustomers(customers.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    setPage(0)
    setTimeout(() => {
      loadCustomers()
    }, 0)
  }

  function handleClearSearch() {
    setSearch({ name: '', email: '', statusCode: '' })
    setPage(0)

    const params = new URLSearchParams()
    params.append('page', 0)
    params.append('size', 10)
    params.append('sort', sort)
    params.append('direction', direction)

    fetch(`${API_URL}/page?${params.toString()}`, {
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 401) {
          onUnauthorized()
          return null
        }

        return response.json()
      })
      .then((data) => {
        if (!data) return

        setCustomers(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => {
        setError('顧客一覧の取得に失敗しました')
      })
  }

  return (
    <>
      <header>
        <h1>Customer Management System</h1>
      </header>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <h2>顧客検索</h2>
        </div>

        <form className="customer-form" onSubmit={handleSearch}>
          <label>
            名前
            <input
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
              placeholder="名前で検索"
            />
          </label>

          <label>
            メール
            <input
              value={search.email}
              onChange={(e) => setSearch({ ...search, email: e.target.value })}
              placeholder="メールで検索"
            />
          </label>

          <label>
            ステータス
            <select
              value={search.statusCode}
              onChange={(e) => setSearch({ ...search, statusCode: e.target.value })}
            >
              <option value="">すべて</option>
              {statuses.map((status) => (
                <option key={status.statusCode} value={status.statusCode}>
                  {status.statusName}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit">検索</button>
            <button
              type="button"
              className="secondary"
              onClick={handleClearSearch}
            >
              クリア
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>表示条件</h2>
        </div>

        <div className="customer-form">
          <label>
            並び替え項目
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(0)
              }}
            >
              <option value="id">ID</option>
              <option value="name">名前</option>
              <option value="email">メール</option>
              <option value="processedAt">処理日時</option>
              <option value="statusCode">ステータス</option>
            </select>
          </label>

          <label>
            並び順
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value)
                setPage(0)
              }}
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>顧客一覧</h2>
          <button type="button" onClick={onCreate}>
            顧客登録
          </button>
        </div>

        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            前へ
          </button>

          <span>
            {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            次へ
          </button>
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
                      <button
                        type="button"
                        onClick={() => onEdit(customer.id)}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => handleDelete(customer.id)}
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

        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            前へ
          </button>

          <span>
            {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            次へ
          </button>
        </div>
      </section>
    </>
  )
}

export default CustomerPage