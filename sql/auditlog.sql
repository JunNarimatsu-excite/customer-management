CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    login_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100),
    operation VARCHAR(50) NOT NULL,
    target VARCHAR(100),
    detail TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_logs IS '監査ログ';
COMMENT ON COLUMN audit_logs.login_id IS 'ログインID';
COMMENT ON COLUMN audit_logs.user_name IS 'ユーザー名';
COMMENT ON COLUMN audit_logs.operation IS '操作内容';
COMMENT ON COLUMN audit_logs.target IS '操作対象';
COMMENT ON COLUMN audit_logs.detail IS '詳細';
COMMENT ON COLUMN audit_logs.created_at IS '作成日時';