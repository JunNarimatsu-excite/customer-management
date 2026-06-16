import { useEffect, useState } from 'react'

const DASHBOARD_URL = 'http://20.196.152.70:30081/api/dashboard'

function DashboardPage({ onUnauthorized, loginUser }) {

  const [stats, setStats] = useState({
    customerCount: 0,
    userCount: 0,
    statusCount: 0,
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {

    const response = await fetch(DASHBOARD_URL, {
      credentials: 'include',
    })

    if (response.status === 401) {
      onUnauthorized()
      return
    }

    const data = await response.json()

    setStats(data)
  }

  return (
    <>
      <header>
        <h1>ダッシュボード</h1>
      </header>

      <div className="dashboard">

        <div className="card">
          <h3>顧客数</h3>
          <p>{stats.customerCount}</p>
        </div>

        <div className="card">
          <h3>ユーザー数</h3>
          <p>{stats.userCount}</p>
        </div>

        <div className="card">
          <h3>ステータス数</h3>
          <p>{stats.statusCount}</p>
        </div>

        <div className="card">
          <h3>ログインユーザー</h3>
          <p>{loginUser?.name}</p>
        </div>

      </div>
    </>
  )
}

export default DashboardPage