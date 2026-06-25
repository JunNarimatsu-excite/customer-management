import { useEffect, useState } from 'react'

const API_URL = 'http://20.196.152.70:30081/api/customers'
const STATUS_URL = 'http://20.196.152.70:30081/api/customers/statuses'
const BLOB_UPLOAD_URL = '/api/blob/upload'

function CustomerFormPage({ customerId, onUnauthorized, onCompleted, onCancel }) {
  const isEditMode = customerId !== null && customerId !== undefined

  const [statuses, setStatuses] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    statusCode: 'ST01',
    imageUrl: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStatuses()

    if (isEditMode) {
      loadCustomer(customerId)
    }
  }, [customerId])

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

  async function loadCustomer(id) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        throw new Error('顧客情報の取得に失敗しました')
      }

      const customer = await response.json()

      setForm({
        name: customer.name ?? '',
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        statusCode: customer.statusCode ?? 'ST01',
        imageUrl: customer.imageUrl ?? '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.name.trim()) {
      setError('名前は必須です')
      return
    }

    setLoading(true)

    try {
      let imageUrl = form.imageUrl

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch(BLOB_UPLOAD_URL, {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        })

        if (uploadResponse.status === 401) {
          onUnauthorized()
          return
        }

        if (!uploadResponse.ok) {
          throw new Error('画像アップロードに失敗しました')
        }

        imageUrl = await uploadResponse.text()
      }

      const method = isEditMode ? 'PUT' : 'POST'
      const url = isEditMode ? `${API_URL}/${customerId}` : API_URL

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl }),
      })

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(errorBody || '保存に失敗しました')
      }

      await response.json()

      if (isEditMode) {
        onCompleted(`顧客編集が完了しました ID:${customerId}`)
      } else {
        onCompleted('顧客登録が完了しました')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header>
        <h1>Customer Management System</h1>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>{isEditMode ? '顧客編集' : '顧客登録'}</h2>
        </div>

        {loading && <p>読み込み中...</p>}
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

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
            顧客画像
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>

          {form.imageUrl && (
            <div>
              <img
                src={`/api/blob/view?url=${encodeURIComponent(form.imageUrl)}`}
                alt="顧客画像"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

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
            <button type="submit" className="primary" disabled={loading}>
              {isEditMode ? '更新' : '登録'}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              戻る
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default CustomerFormPage