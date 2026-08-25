# 🌱 Krishi Kendra — Smart Agriculture Information Platform

Krishi Kendra is a centralized full-stack agricultural information platform engineered to empower Indian farmers with verified, actionable, and real-time farming intelligence. Built with **Spring Boot 3.3.4 (Java 21)** and **React 18 (Vite + Tailwind CSS)**, the platform unifies Mandi market price discovery, weather-based agro-advisories, government direct benefit transfer (DBT) welfare schemes, historical price trends, and a context-grounded AI agricultural assistant.

---

## 🚀 Key Modules & Capabilities

1. **🌾 Mandi / Market Prices Discovery**
   - Live APMC arrival rates, minimum, maximum, and modal transaction prices across 28+ Indian States and Union Territories.
   - Dynamic cascading filters by State, District, Mandi/Market, Commodity, and Arrival Date.
   - 1-Click CSV export and favorite crop bookmarking.
   - Integration with Data.gov.in and Agmarknet open government datasets.

2. **📈 Historical Price Trend Visualizer**
   - Interactive line and area charts powered by **Recharts**.
   - Visualizes price volatility and modal movements over 7-Day, 1-Month, 3-Month, and 1-Year windows.
   - Real-time calculations of Highest, Lowest, Average, and Period Percentage (% Growth) metrics to guide farmers on optimal selling windows.

3. **🌦️ Weather Forecasting & Agro-Advisories**
   - Real-time conditions (temperature, feels-like, humidity, wind speed, sunrise/sunset) via **OpenWeather API**.
   - 5-day agricultural weather forecast with precipitation probability indicators.
   - Automated rule-based agro-advisories for rainfall drainage, irrigation delays, high-temperature heat stress, and pesticide spraying suitability.

4. **🏛️ Government Welfare Schemes Directory**
   - Curated directory of official Central and State government schemes (e.g., PM-KISAN, PMFBY Crop Insurance, PMKSY Micro-Irrigation, Kisan Credit Card, Sub-Mission on Agricultural Mechanization).
   - Filter by Central vs. State scope and categorical pills (Subsidies, Loans & Credit, Machinery, Insurance).
   - Modal views with detailed eligibility requirements, direct financial benefit breakdowns, and verified application portal links.

5. **📰 Agricultural News & Advisory Bulletins**
   - Real-time advisories on Minimum Support Price (MSP) revisions, fertilizer availability, monsoon tracking, and pest warnings from official sources (PIB, ICAR, IMD).

6. **🤖 Grounded AI Agricultural Assistant (Krishi Mitra)**
   - Conversational assistant grounded directly on live Mandi database records, weather reports, and verified schemes to eliminate AI hallucinations.
   - Includes transparent "Verified Sources" citations and follow-up suggestion chips.
   - Supports English and Hindi queries.

7. **📊 Farmer Dashboard & Profile Management**
   - Personalized dashboard with local weather, top Mandi rates, and bookmarked crops ticker.
   - Farmer profile manager with multi-language toggle (English / हिंदी).

8. **🛡️ Platform Governance & Administration**
   - Comprehensive admin dashboard with platform metrics (registered farmers, active schemes, price records).
   - Full CRUD management for Government Schemes and News Advisories.
   - User directory with role management (`FARMER` / `ADMIN`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21 LTS, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate, Maven |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React Icons, Recharts, Axios, React Router 6 |
| **Authentication** | Stateless JWT (JJWT 0.12.5) with BCrypt password hashing & Role-Based Access Control |
| **Database** | MySQL 8.0 (with H2 in-memory profile for automated unit testing) |
| **APIs** | OpenWeatherMap API, Data.gov.in / Agmarknet API, Gemini / OpenAI AI Integration |
| **Containerization** | Docker, Docker Compose, Multi-stage builds, Nginx |

---

## 📂 Project Structure

```
KrishiKendra/
├── backend/
│   ├── src/main/java/com/krishikendra/
│   │   ├── config/              # Security, CORS, RestTemplate, Seed Data Initializer
│   │   ├── controller/          # REST Controllers (Auth, Mandi, Weather, Schemes, News, AI, Admin)
│   │   ├── dto/                 # Request and Response Data Transfer Objects
│   │   ├── entity/              # JPA Entities (User, Role, MarketPrice, Scheme, News, Favorite)
│   │   ├── exception/           # Custom Exceptions & Global Exception Handler
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   ├── security/            # JWT Token Service, Filter & UserDetailsService
│   │   └── service/             # Business Logic & External API Integrations
│   ├── src/main/resources/      # application.yml
│   ├── src/test/resources/      # application-test.yml & JUnit Tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, WeatherCard, PriceCard, SchemeCard, NewsCard, etc.
│   │   ├── context/             # AuthContext, LanguageContext (English & Hindi)
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Mandi, Trends, Weather, Schemes, News, Assistant, Profile, Admin
│   │   ├── services/            # Axios API Service Modules
│   │   ├── utils/               # Constants, Currency & Date Formatters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔐 Default Demo Credentials

The application automatically seeds verified demo accounts on first launch:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Farmer (Demo)** | `farmer@krishikendra.gov.in` | `Farmer@123` |
| **Administrator** | `admin@krishikendra.gov.in` | `Admin@123` |

*(Quick-fill buttons are provided on the Login page for 1-click test authentication).*

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 LTS** & **Apache Maven 3.9+**
- **Node.js 18+** & **npm**
- **MySQL 8.0** (or run via Docker)

### Option 1: Run Locally

#### 1. Start Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
The backend starts at `http://localhost:8080` (API endpoint: `http://localhost:8080/api`).

#### 2. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

### Option 2: Run with Docker Compose

To spin up MySQL, Spring Boot Backend, and Nginx Frontend in isolated containers:
```bash
docker-compose up --build
```
Access the application at `http://localhost`.

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new farmer account |
| `POST` | `/api/auth/login` | Public | Login and obtain JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user |
| `GET` | `/api/market-prices` | Public | Search Mandi prices with filters |
| `GET` | `/api/market-prices/trends` | Public | Get historical price trend time series |
| `GET` | `/api/market-prices/highlights`| Public | Get top price highlights by state |
| `GET` | `/api/weather` | Public | Get current weather & agro-advisories |
| `GET` | `/api/schemes` | Public | Search and filter government schemes |
| `POST`| `/api/schemes` | Admin | Create new government scheme |
| `GET` | `/api/news` | Public | Get agricultural news and advisories |
| `POST`| `/api/news` | Admin | Publish new agricultural advisory |
| `GET` | `/api/favorites` | Authenticated | Get farmer's bookmarked crops & mandis |
| `POST`| `/api/favorites` | Authenticated | Bookmark a crop and market |
| `POST`| `/api/assistant/chat` | Public | Query Krishi Mitra AI assistant |
| `GET` | `/api/admin/stats` | Admin | Platform metrics and KPI counts |
| `GET` | `/api/admin/users` | Admin | List registered platform users |

---

## 🧪 Automated Testing

Run the comprehensive unit and integration test suite:
```bash
cd backend
mvn test
```

---

## 🛡️ License & Acknowledgements
- Data sourced from **Agmarknet**, **Open Government Data (data.gov.in)**, and **OpenWeatherMap**.
- Built with precision for Indian agriculture.
