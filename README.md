# Customer Management

React + Spring Boot + PostgreSQL を使用した顧客管理システムです。

## 技術構成

- React
- Spring Boot
- PostgreSQL
- Maven

## 機能

- 顧客一覧
- 顧客登録
- 顧客更新
- 顧客削除

## 現在の進捗

- バックエンド REST API は実装済み
- 顧客登録・編集・削除・一覧取得が可能
- フロントエンドは React で顧客管理画面を提供
- ルート `/` で API の稼働確認が可能

## 起動手順

### 1. データベース初期化

PostgreSQL に接続して以下を実行します：

```bash
psql -U postgres -d postgres -f sql/setup.sql
```

または、psql に接続後に以下を実行します：

```sql
\i sql/setup.sql
```

### 2. バックエンドの起動

```bash
cd backend
mvn spring-boot:run
```

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

### 確認

- フロントエンド: `http://localhost:5173`
- バックエンド API: `http://localhost:8080/api/customers`
- システム稼働確認: `http://localhost:8080/`
