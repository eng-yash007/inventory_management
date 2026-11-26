<div align="center">

# 📦 StockPulse — Inventory Management System

**A full-stack, role-based Inventory & Warehouse Management System built with Spring Boot 3, Spring Security (JWT), MySQL, and React 19 + Tailwind CSS v4.**

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## ✨ Overview

**StockPulse** streamlines end-to-end stock control, purchase order workflows, multi-warehouse transfers, invoice tracking, and supplier/customer portals inside a modern, responsive UI with **System / Light / Dark** theme support.

---

## 🚀 Key Features

- **🔐 JWT Authentication & Role-Based Access Control (RBAC)**
  - Stateless JWT auth with BCrypt password hashing
  - Roles: `ADMIN`, `MANAGER`, `STAFF`, `SUPPLIER_CONTACT`, and `CUSTOMER`
  - Dedicated **Supplier Portal** (`/portal/supplier`) and **Customer Catalogue** (`/portal/customer`)
- **📊 Modern Dashboard & Low-Stock Alerts**
  - Live KPI cards for Total Products, Low Stock Items, Total Warehouses, and Active Suppliers
  - Visual stock-level progress bars and threshold indicators
- **📦 Product & Category Management**
  - Live search (Name, SKU, Barcode), category filtering, and low-stock quick filter
  - Soft deactivation (`PATCH /api/products/{id}/deactivate`) and camera-based **Barcode Scanner** (`@zxing/browser`)
- **🏭 Multi-Warehouse & Stock Transfers**
  - Manage multiple warehouse locations and transfer stock across warehouses
- **🔄 Inventory Transactions & Approval Workflow**
  - Supports `STOCK_IN`, `STOCK_OUT`, `DAMAGED`, `LOST`, `ADJUSTMENT`, and `CORRECTION`
  - Optimistic locking (`@Version`) to prevent concurrent stock update race conditions
  - Manager/Admin approval workflow for exceptional adjustments and append-only audit trail
- **🧾 Purchase Orders, Invoices & Supplier Reports**
  - Multi-line-item Purchase Orders, Invoice management, Supplier directory, and Supplier performance reports
- **🔔 Notifications & Theme Support**
  - Low-stock notification center and adaptive **System / Light / Dark** theme switcher

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA / Hibernate, Maven |
| **Database** | MySQL 8.0 |
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Tailwind CSS v4, `@zxing/browser` |
| **Testing** | Vitest, React Testing Library, JUnit |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🏗️ Architecture

```text
Controller ──▶ Service ──▶ Repository ──▶ Entity (MySQL)
```

Core domain relationships:

```text
Category (1) ──────────< (many) Product
Product  (1) ──────────< (many) InventoryTransaction
Product  (1) ──────────< (many) PurchaseOrderItem
Supplier (1) ──────────< (many) PurchaseOrder
PurchaseOrder (1) ─────< (many) PurchaseOrderItem
PurchaseOrder (1) ─────< (many) InventoryTransaction (nullable)
User (1) ──────────────< (many) InventoryTransaction, PurchaseOrder, UserActivityLog
```

---

## 📁 Project Structure

```text
inventory-management-system/
├── backend/                 # Spring Boot 3 REST API & security layer
│   ├── src/main/java/       # Controllers, services, repositories, entities, JWT config
│   ├── src/main/resources/  # application.properties templates
│   └── Dockerfile
├── frontend/                # React 19 + Vite + Tailwind CSS v4 SPA
│   ├── src/components/      # Layout shell, ProtectedRoute, BarcodeScanner
│   ├── src/context/         # AuthContext (JWT decoding & role state)
│   ├── src/pages/           # Dashboard, Products, Warehouses, POs, Invoices, Portals
│   └── src/__tests__/       # Vitest + Testing Library unit tests
├── docs/                    # Requirements & screenshots
├── docker-compose.yml       # Full-stack MySQL + Backend + Frontend orchestration
└── .env.example             # Environment variable template
```

---

## ⚡ Getting Started

### Option 1: Docker Compose (Recommended)

```bash
cp .env.example .env
docker compose up --build
```

- **Frontend:** `http://localhost` (or configured port in `docker-compose.yml`)
- **Backend API:** `http://localhost:8080`
- **MySQL:** `localhost:3306`

### Option 2: Run Locally

#### 1. Backend (Java 21 + Maven + MySQL 8+)
```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Update database credentials and JWT secret in application.properties
mvn spring-boot:run
```
Backend starts on `http://localhost:8080`.

#### 2. Frontend (Node.js 20+ recommended)
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on `http://localhost:5173`.

---

## 🧪 Running Frontend Tests & Build

```bash
cd frontend
npm run build
npm test
```

> **Note:** If using Node.js 25/26+, run tests with `NODE_OPTIONS="--no-experimental-webstorage" npm test` so `jsdom` handles `localStorage` cleanly.

---

## 🔌 API Overview

| Module | Base Path | Access |
|---|---|---|
| **Auth** | `/api/auth` | `login`, `register`, `register-privileged` (Admin only) |
| **Categories** | `/api/categories` | Read: All roles · Write: Admin / Manager |
| **Products** | `/api/products` | Read: All roles · Write: Admin / Manager |
| **Warehouses & Transfers** | `/api/warehouses` | Admin / Manager |
| **Purchase Orders** | `/api/purchase-orders` | Admin / Manager / Staff |
| **Stock Transactions** | `/api/inventory-transactions` | Stock In/Out: Staff+ · Approve/Reject: Admin / Manager |
| **Invoices & Suppliers** | `/api/invoices`, `/api/suppliers` | Admin / Manager |
| **Notifications & Logs** | `/api/notifications`, `/api/activity-logs` | Admin / Manager |

---

## 📄 License

This project is open source under the terms of the [LICENSE](LICENSE) file.
