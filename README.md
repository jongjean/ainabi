# AINABI Project (v0.1)

AI상담소 NAVI: 인과관계 분석 및 지능형 코칭 플랫폼

## 🛠 Project Structure
- `apps/frontend`: Next.js Web Application
- `apps/backend`: Node.js Express API Server
- `infra/docker`: Database & Cache (PostgreSQL, Redis)
- `infra/scripts`: Deployment & Management scripts

## 🚀 How to Restore / Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/jongjean/ainabi.git
   cd ainabi
   ```

2. **Environment Setup**
   - Copy `apps/backend/.env.example` to `apps/backend/.env` and fill in the values (especially API keys).
   
3. **Infrastructure (Database)**
   - Use Docker to spin up the database:
     ```bash
     cd infra/docker
     docker-compose up -d
     ```
   - Initialize database schema:
     ```bash
     psql -h localhost -p 5500 -U ainabi -d ainabi_db -f ../db/init.sql
     psql -h localhost -p 5500 -U ainabi -d ainabi_db -f ../../apps/backend/src/db/refactor_schema.sql
     ```

4. **Install & Run**
   - Backend:
     ```bash
     cd apps/backend
     npm install
     npm run dev
     ```
   - Frontend:
     ```bash
     cd apps/frontend
     npm install
     npm run dev
     ```

## ⚠️ Important Note on Backups
- **Code**: Safely stored in this Git repository.
- **Secrets**: `.env` files are NOT in Git. Keep a separate backup of your API keys.
- **User Data**: The actual database records (counseling history) are NOT in Git. Please perform regular DB dumps to ensure data safety.
