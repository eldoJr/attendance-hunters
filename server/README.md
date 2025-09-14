# Attendance Management System - Server

Clean modular architecture with separate dependencies for each component.

## Structure

```
server/
├── api/           # Backend API (Express, JWT, etc.)
├── database/      # Database layer (Prisma, PostgreSQL)
├── web/           # Frontend (React, existing)
└── .env           # Environment variables
```

## Setup Instructions

### 1. Database Setup
```bash
cd database
npm install
npm run generate    # Generate Prisma client
npm run push        # Deploy schema to database
npm run seed        # Seed sample data
```

### 2. API Setup
```bash
cd api
npm install
npm run dev         # Start development server
```

### 3. Web Setup
```bash
cd web
npm install
npm start           # Start React development server
```

## Environment Variables

1. Copy `.env.example` to `.env` in server root:
```bash
cp .env.example .env
```

2. Update `.env` with your actual values:
```env
DATABASE_URL="your_actual_database_url"
JWT_SECRET=your_actual_jwt_secret
JWT_EXPIRES_IN=24h
```

## Development Workflow

1. **Database changes**: Work in `database/` folder
2. **API development**: Work in `api/` folder  
3. **Frontend changes**: Work in `web/` folder
4. **Deploy separately**: Each component has its own dependencies

## Benefits

- ✅ Clean separation of concerns
- ✅ Independent deployment
- ✅ Modular dependencies
- ✅ Easy maintenance
- ✅ No unnecessary files in root