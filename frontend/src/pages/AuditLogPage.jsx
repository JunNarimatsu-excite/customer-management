import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080/api/audit-logs'

function AuditLogPage({ onUnauthorized }) {

  const [logs, setLogs] = useState([])

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {

    const response = await fetch(API_URL, {
      credentials: 'include'
    })

    if (response.status === 401) {
      onUnauthorized()
      return
    }

    const data = await response.json()

    setLogs(data)
  }

  return (
    <>
      <h1>監査ログ</h1>

      <table>
        <thead>
          <tr>
            <th>日時</th>
            <th>ユーザー</th>
            <th>操作</th>
            <th>対象</th>
            <th>詳細</th>
          </tr>
        </thead>

        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.createdAt}</td>
              <td>{log.userName}</td>
              <td>{log.operation}</td>
              <td>{log.target}</td>
              <td>{log.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AuditLogPage