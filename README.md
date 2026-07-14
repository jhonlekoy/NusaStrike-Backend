# NusaStrike Backend 🎣

Professional Fishing Application Backend - Node.js + Express + PostgreSQL

## Features

- 🔐 User Authentication (JWT)
- 🎯 Fishing Spot Management
- 📊 Catch Logging & Statistics
- 🌤️ Weather & Water Conditions
- 👥 Social Feed & Comments
- 💳 Subscription Management (Midtrans)
- 🤖 AI Predictions (Phase 2)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcryptjs
- **Payment**: Midtrans
- **Weather**: Open-Meteo API (free)

## Setup

### 1. Prerequisites

- Node.js >= 14
- PostgreSQL >= 12
- npm or yarn

### 2. Installation

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 4. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nusastrike_db;

# Run schema
\c nusastrike_db
\i db/schema.sql
```

### 5. Run Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Catches
- `POST /api/catches` - Log a catch
- `GET /api/catches` - Get user's catches
- `GET /api/catches/:id` - Get catch details
- `GET /api/catches/stats/summary` - Get statistics

### Spots
- `GET /api/spots` - Get all spots
- `GET /api/spots/nearby` - Get nearby spots
- `POST /api/spots` - Create new spot

### Weather
- `GET /api/weather` - Get weather for location
- `GET /api/weather/water-conditions/:spotId` - Get water conditions

### Feed
- `GET /api/feed` - Get social feed
- `POST /api/feed/:catchId/like` - Like a catch
- `POST /api/feed/:catchId/comments` - Add comment

### Subscription
- `GET /api/subscription/plans` - Get plans
- `GET /api/subscription/user` - Get user subscription
- `POST /api/subscription/create` - Create subscription

## Development

### Project Structure

```
src/
├── index.js              # Main server file
├── config/
│   └── database.js       # Database connection
├── middleware/
│   └── auth.js           # JWT middleware
└── routes/
    ├── auth.js           # Auth endpoints
    ├── users.js          # User endpoints
    ├── catches.js        # Catch endpoints
    ├── spots.js          # Spot endpoints
    ├── weather.js        # Weather endpoints
    ├── feed.js           # Feed endpoints
    └── subscription.js   # Subscription endpoints
db/
└── schema.sql            # Database schema
```

### Next Steps

- [ ] Implement error handling & validation (Joi)
- [ ] Add rate limiting
- [ ] Integrate Midtrans payment gateway
- [ ] Add email verification
- [ ] Implement refresh tokens
- [ ] Add logging system
- [ ] Write unit tests
- [ ] Deploy to production

## API Documentation

Full API documentation available at `/api-docs` (Swagger - to be added)

## License

MIT

---

Happy fishing! 🎣
