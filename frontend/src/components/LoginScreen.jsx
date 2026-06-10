import { useState } from 'react'

function LoginScreen({ onLogin, error }) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin(id, password)
  }

  return (
    <div className="container">
      <section className="panel">
        <div className="panel-header">
          <h2>ログイン</h2>
        </div>

        <form className="customer-form" onSubmit={handleSubmit}>
          <label>
            ログインID
            <input value={id} onChange={(e) => setId(e.target.value)} />
          </label>

          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="form-actions">
            <button type="submit">ログイン</button>
          </div>
        </form>

        {error && <div className="message error">{error}</div>}
      </section>
    </div>
  )
}

export default LoginScreen