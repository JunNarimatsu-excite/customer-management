# Customer Management System 引継ぎメモ

## 環境

### Backend

* Java 17
* Spring Boot 3.1.5
* PostgreSQL 17
* Maven

### Frontend

* React
* Vite

---

## 認証

### 実装済み

* ログイン
* ログアウト
* HttpSession認証
* LoginCheckInterceptor
* AdminCheckInterceptor

### API

POST /api/login

POST /api/logout

GET /api/me

---

## ユーザー権限

ADMIN

USER

---

## 実装済み画面

### DashboardPage

表示項目

* 顧客数
* ユーザー数
* ステータス数
* ログインユーザー

---

### CustomerPage

実装済み

* 顧客一覧
* 顧客登録
* 顧客更新
* 顧客削除

検索機能実装途中

---

### UserPage

実装済み

* ユーザー一覧
* ユーザー登録
* ユーザー更新
* ユーザー削除

---

### StatusPage

実装済み

* ステータス一覧
* ステータス登録
* ステータス更新
* ステータス削除

---

### AuditLogPage

実装済み

* 監査ログ一覧表示

---

## Layout構成

左メニュー

* ダッシュボード
* 顧客管理

ADMINのみ

* ユーザー管理
* ステータス管理
* 監査ログ

---

## 監査ログ

テーブル

audit_logs

項目

* id
* login_id
* user_name
* operation
* target
* detail
* created_at

AuditLogServiceで保存

AuditLogPageで表示

---

## App.jsx

selectedMenu

* dashboard
* customers
* users
* statuses
* auditLogs

DashboardPage導入済み

AuditLogPage導入済み

---

## WebConfig

loginCheckInterceptor

* /api/customers/**
* /api/dashboard

adminCheckInterceptor

* /api/users/**
* /api/statuses/**
* /api/audit-logs

---

## 現在の課題

検索・ページング・ソート機能を実装中

CSV出力・CSV取込は未実装

---

## 次に実装予定

1. 顧客検索
2. ページング
3. ソート
4. CSV出力
5. CSV取込
6. パスワード変更
