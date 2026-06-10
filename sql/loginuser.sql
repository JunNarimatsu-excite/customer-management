-- テーブル作成
CREATE TABLE login_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- テーブル論理名
COMMENT ON TABLE login_users IS 'ログインユーザー';

-- カラム論理名
COMMENT ON COLUMN login_users.id IS 'ログインID';
COMMENT ON COLUMN login_users.name IS 'ユーザー名';
COMMENT ON COLUMN login_users.password IS 'パスワード';
COMMENT ON COLUMN login_users.email IS 'メールアドレス';
COMMENT ON COLUMN login_users.enabled IS '有効フラグ';
COMMENT ON COLUMN login_users.created_at IS '作成日時';
COMMENT ON COLUMN login_users.updated_at IS '更新日時';