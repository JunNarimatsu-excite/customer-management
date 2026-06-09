# セットアップガイド

このプロジェクトをセットアップして実行するための手順です。

## 前提条件

- Node.js 16.x 以上
- Java 17 以上
- Maven 3.6 以上
- PostgreSQL 13 以上
- Git

## Frontend のセットアップ

```bash
cd frontend
npm install
npm run dev
```

### 起動確認
- http://localhost:5173 にアクセス
- 顧客管理 UI が表示されることを確認

## Backend のセットアップ

### 1. データベースの初期化

PostgreSQL に接続して以下を実行します：

```bash
psql -U postgres -d postgres -f sql/setup.sql
```

または、psql に接続後に以下を実行します：

```sql
\i sql/setup.sql
```

### 2. Spring Boot アプリケーションの起動

```bash
cd backend
mvn spring-boot:run
```

### 起動確認
- http://localhost:8080/api/customers にアクセス
- JSON形式で顧客一覧が表示されることを確認
- http://localhost:8080/ にアクセスすると API 状態が確認できます

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/customers | すべての顧客を取得 |
| GET | /api/customers/{id} | 特定の顧客を取得 |
| POST | /api/customers | 新しい顧客を作成 |
| PUT | /api/customers/{id} | 顧客を更新 |
| DELETE | /api/customers/{id} | 顧客を削除 |

## トラブルシューティング

### Frontend
- `npm: command not found` → Node.js をインストール

### Backend
- データベース接続エラー → PostgreSQL が起動していることを確認し、application.properties の設定を確認
- `JAVA_HOME` エラー → JAVA_HOME は JDK ルートに設定する

## ファイル構成

```
customer-management/
├── frontend/         # React + Vite プロジェクト
│   ├── src/          # ソースコード
│   ├── package.json
│   └── vite.config.js
├── backend/          # Spring Boot プロジェクト
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── sql/              # データベース初期化スクリプト
│   └── setup.sql
└── README.md         # プロジェクト説明
```
