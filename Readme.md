SmartBank - Modular Banking Backend System

Project Overview 

SmartBank is a modular backend system for banking operations designed for clarity, security, and easy extension.This README covers a recommended 4-usecase implementation

Features:

1) User Registration & KYC — register users, upload/verify KYC documents, basic identity checks.

2) Account Creation — create multiple account types (Savings, Current), link to user, initial balance.

3) Money Transfer — internal transfers between accounts, transfer validation, balance updates.

4) Audit Logging — immutable, tamper-evident logs for all critical actions and API calls.



Application Overview:


1) auth-kyc-service -user sign-up, KYC submission, basic verification status.
2) account-service - account creation, balance management, account metadata.
3) transfer-service - money transfer orchestration (validation, reserve, commit/rollback). Edge cases - Insufficient funds , Eceeding daily limits
4) audit-service - append-only audit logs (writes from all services via HTTP or message queue).


Tech Stack:
Frontend : React + Vite
Backend: Python FastAPI, Security (JWT).
Database: PostgreSQL.
API Docs: Swagger API documentation.
Testing: pytest
CI/CD: GitHub Actions



Service Design & Key APIs:

1) Auth & KYC Service (auth-kyc-service)

Responsibilities:

Register users, store basic profile

Accept KYC document uploads and store S3 keys

Maintain kyc_status (PENDING, VERIFIED, REJECTED)

APIs:

POST /api/v1/users — create user (name, email, phone)

GET /api/v1/users/{user_id} — get user profile & KYC status

POST /api/v1/users/{user_id}/kyc — upload KYC doc (multipart) -> returns doc_id

PUT /api/v1/users/{user_id}/kyc/verify — (admin) mark VERIFIED/REJECTED

Minimal DB tables (Postgres):

users(id, name, email UNIQUE, phone, created_at, updated_at)

kyc_documents(id, user_id FK, s3_key, doc_type, status, uploaded_at, verified_at)

2) Account Service (account-service)

Responsibilities:

Create bank accounts linked to users

Maintain balances and ledger references

APIs:

POST /api/v1/accounts — create an account {user_id, account_type, currency, initial_deposit}

GET /api/v1/accounts/{account_id} — account details and balance

GET /api/v1/users/{user_id}/accounts — list accounts for a user

DB tables:

accounts(id, user_id FK, account_number UNIQUE, type, currency, balance_decimal, status, created_at)

ledgers(id, account_id FK, txn_id, amount, txn_type (CREDIT/DEBIT), balance_after, created_at)


3) Transfer Service (transfer-service)

Responsibilities:

Orchestrate transfers between accounts (internal)

Use two-phase operations: validate -> reserve -> commit/rollback

Emit audit events for each step

APIs:

POST /api/v1/transfers — create transfer {from_account, to_account, amount, currency, idempotency_key} -> returns transfer_id and status

GET /api/v1/transfers/{transfer_id}

Sequence (simplified):

Validate accounts exist, currency match, sufficient balance.

Acquire distributed lock on from_account (Redis lock using idempotency key).

Create a pending transfer record and insert ledger entries with status=PENDING.

Subtract amount from from_account.balance and add to to_account.balance in a DB transaction (or use reserved fields + finalize step).

Mark transfer COMPLETED, release lock, emit audit event. On failure, rollback and emit FAILED with reason.

DB tables:

transfers(id, from_account, to_account, amount, currency, status, idempotency_key, created_at, completed_at)



4) Audit Service (audit-service)

Responsibilities:

Collect and store audit events from other services

Provide query API for admins

APIs:

POST /api/v1/audit — append event {source_service, event_type, payload, user_id, reference_id, timestamp}

GET /api/v1/audit?service=&user_id=&from=&to=&event_type= — query logs

Storage:

Append-only table audit_logs(id, source, event_type, payload JSONB, user_id, reference_id, created_at)



Databse ER: 

Users(1) ---- (N) accounts



Testing

Unit tests per service with pytest. Focus on: validation, balance arithmetic, ledger consistency.

Integration tests: run services with test DB, simulate transfers and check ledger vs balances.

E2E tests: simulate flows from user registration -> account creation -> fund transfer


