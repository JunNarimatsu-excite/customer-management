function Layout({ loginUser, selectedMenu, setSelectedMenu, onLogout, children }) {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <h2>メニュー</h2>

                <button
                    className={selectedMenu === 'customers' ? 'menu active' : 'menu'}
                    onClick={() => setSelectedMenu('customers')}
                >
                顧客管理
                </button>

                {loginUser.role === 'ADMIN' && (
                    <>
                        <button
                            className={selectedMenu === 'users' ? 'menu active' : 'menu'}
                            onClick={() => setSelectedMenu('users')}
                        >
                        ユーザー管理
                        </button>

                        <button
                            className={selectedMenu === 'statuses' ? 'menu active' : 'menu'}
                            onClick={() => setSelectedMenu('statuses')}
                        >
                        ステータス管理
                        </button>
                    </>
                )}

                <div className="sidebar-footer">
                    <div>ログイン中：{loginUser.name}</div>
                    <button className="secondary" onClick={onLogout}>
                        ログアウト
                    </button>
                </div>
            </aside>

            <main className="main-content">{children}</main>
        </div>
    )
}

export default Layout