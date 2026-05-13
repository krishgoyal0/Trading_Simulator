Here's your **polished, professional README** - ready to impress recruiters:

---

```markdown
# 💹 TradeFlow - Trading Simulator Backend

A production-grade trading simulator backend with **real-time stock prices**, **WebSocket live updates**, and **complete portfolio management**. Built with Spring Boot, integrated with Finnhub API, and ready for deployment.

[![Java](https://img.shields.io/badge/Java-17-007396?logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-010101?logo=websocket)](https://stomp.github.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Quick Overview

| Feature | Status |
|---------|--------|
| **Users** | Register, soft delete, reactivate |
| **Wallet** | Add money, check balance, transaction history |
| **Trading** | Buy/Sell stocks at live market prices |
| **Portfolio** | Automatic position tracking, average price calculation |
| **Real-time** | WebSocket push updates every 30 seconds |
| **Assets** | 19 US stocks + 5 cryptocurrencies |

---

## 🚀 Key Features

### Core Trading
- ✅ **User Management** - Registration, soft delete, reactivation
- ✅ **Wallet System** - Add funds, balance check, transaction ledger
- ✅ **Live Trading** - Buy/Sell stocks at real-time market prices
- ✅ **Portfolio Tracking** - Auto-updating positions with average cost basis
- ✅ **Order History** - Complete audit trail of all trades
- ✅ **Net Worth** - Real-time cash + stock valuation

### Technical Highlights
- 🌐 **Real-time Market Data** - Finnhub API integration (60 calls/minute)
- ⚡ **WebSocket Push** - Live price updates without page refresh
- 🔄 **Auto Price Refresh** - Every 30 seconds during market hours
- 💎 **24/7 Crypto Support** - Bitcoin, Ethereum, Dogecoin, Cardano, Solana
- 📡 **20+ REST APIs** - Ready for any frontend integration
- 🗄️ **MySQL Database** - ACID compliant with JPA/Hibernate

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2 |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | MySQL 8.0 |
| **Real-time** | WebSocket / STOMP / SockJS |
| **Market Data** | Finnhub API |
| **Build Tool** | Maven |
| **Frontend** | HTML5 / CSS3 / JavaScript (Vanilla) |

---

## 📦 API Endpoints (20+)

### 👤 User APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register?name=&email=&password=` | Create account |
| `GET` | `/api/users/{id}` | Get user details |
| `DELETE` | `/api/users/{id}` | Soft delete |
| `PUT` | `/api/users/{id}` | Reactivate |

### 💰 Wallet APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/wallet/add?userId=&amount=` | Deposit funds |
| `GET` | `/api/wallet/{userId}/balance` | Check balance |

### 📈 Trading APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/trading/buy?userId=&stockId=&quantity=` | Execute buy order |
| `POST` | `/api/trading/sell?userId=&stockId=&quantity=` | Execute sell order |

### 📊 Portfolio APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/portfolio/{userId}` | All holdings |
| `GET` | `/api/portfolio/{userId}/value` | Stock portfolio value |
| `GET` | `/api/portfolio/{userId}/networth` | Total net worth |

### 📋 Stock APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stocks` | List all stocks |
| `GET` | `/api/stocks/{id}` | Get by ID |
| `GET` | `/api/stocks/symbol/{symbol}` | Search by symbol |
| `POST` | `/api/stocks/add?name=&symbol=&price=` | Add stock |
| `PUT` | `/api/stocks/{id}/price?newPrice=` | Update price |
| `DELETE` | `/api/stocks/{id}` | Remove stock |

### 📜 Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders/user/{userId}` | User order history |
| `GET` | `/api/orders/{orderId}` | Single order |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                    HTML/CSS/JS + WebSocket                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP / WS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CONTROLLER LAYER                          │
│    UserController │ WalletController │ TradingController         │
│    PortfolioController │ StockController │ OrderController       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                            │
│    UserService │ WalletService │ TradingService                  │
│    PortfolioService │ StockService │ OrderService                │
│    MarketDataService │ PriceUpdateScheduler                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REPOSITORY LAYER                          │
│              JPA Repository Interfaces                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE (MySQL)                         │
│    users │ wallets │ stock │ orders │ transactions │ portfolios │
└─────────────────────────────────────────────────────────────────┘

                    ════════════════════════
                    
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL API (Finnhub)                      │
│              Live stock prices fetched every 30 sec              │
│                         ↓ WebSocket Push                         │
│                    All connected clients update                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚦 Supported Assets

### US Stocks (19)
```
AAPL  | Apple Inc.
MSFT  | Microsoft
GOOGL | Alphabet (Google)
AMZN  | Amazon
NVDA  | NVIDIA
META  | Meta Platforms
TSLA  | Tesla
NFLX  | Netflix
JPM   | JPMorgan Chase
V     | Visa
JNJ   | Johnson & Johnson
WMT   | Walmart
PG    | Procter & Gamble
COST  | Costco
HD    | Home Depot
DIS   | Walt Disney
PEP   | PepsiCo
KO    | Coca-Cola
MCD   | McDonald's
```

### Cryptocurrencies (5)
```
BTC/USDT | Bitcoin
ETH/USDT | Ethereum
DOGE/USDT | Dogecoin
ADA/USDT | Cardano
SOL/USDT | Solana
```

---

## 🔧 Installation & Setup

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Finnhub API Key ([free at finnhub.io](https://finnhub.io))

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/krishgoyal0/Trading_Simulator.git
cd Trading_Simulator/trading_sim_backend

# 2. Create database
mysql -u root -p
CREATE DATABASE trading_db;

# 3. Configure application
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your MySQL and Finnhub credentials

# 4. Build and run
mvn clean install
mvn spring-boot:run

# 5. Access the application
# Backend: http://localhost:8080
# Dashboard: open src/main/resources/static/dashboard.html
```

### Environment Variables (for deployment)

```properties
FINNHUB_API_KEY=your_finnhub_api_key
DB_URL=jdbc:mysql://localhost:3306/trading_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## 📊 Sample API Calls (Postman)

```bash
# 1. Register user
POST http://localhost:8080/api/users/register?name=John&email=john@test.com&password=123

# 2. Add money
POST http://localhost:8080/api/wallet/add?userId=1&amount=10000

# 3. Check balance
GET http://localhost:8080/api/wallet/1/balance

# 4. View available stocks
GET http://localhost:8080/api/stocks

# 5. Buy 10 Apple shares
POST http://localhost:8080/api/trading/buy?userId=1&stockId=1&quantity=10

# 6. View portfolio
GET http://localhost:8080/api/portfolio/1

# 7. Check net worth
GET http://localhost:8080/api/portfolio/1/networth

# 8. View order history
GET http://localhost:8080/api/orders/user/1
```

---

## 🔄 Price Update Mechanism

| Aspect | Details |
|--------|---------|
| **Schedule** | Every 30 seconds |
| **API Rate Limit** | 60 calls/minute (Finnhub free tier) |
| **US Stocks** | 19 stocks → 19 calls per update |
| **Crypto** | 5 assets → 5 calls per update |
| **Total** | 24 calls per update (well under limit) |
| **Market Hours** | US: 7 PM - 1:30 AM IST |
| **Crypto** | 24/7 live updates |

---

## 🗄️ Database Schema

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, name, email, active |
| `wallets` | Balances | id, balance, user_id |
| `stock` | Available stocks | id, symbol, name, price |
| `orders` | Trade records | id, user_id, stock_id, quantity, type, status |
| `transactions` | Money movement | id, wallet_id, amount, type, timestamp |
| `portfolios` | Current holdings | id, user_id, stock_id, quantity, avg_price |

---

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Manual testing with Postman
# Import the provided collection (coming soon)
```

---

## 🚧 Future Roadmap

- [ ] **WebSocket price streaming** (✅ DONE)
- [ ] **Candlestick charts** (⏳ Planned)
- [ ] **Price alerts & notifications**
- [ ] **Paper trading mode**
- [ ] **React frontend** (currently vanilla JS)
- [ ] **Docker containerization**
- [ ] **JWT authentication**
- [ ] **Deployment to cloud (Railway/Render)**

---

## 📁 Project Structure

```
trading_sim_backend/
├── src/main/java/com/k/tradingSimulator/
│   ├── Config/           # WebSocket configuration
│   ├── Controller/       # REST API endpoints (6 controllers)
│   ├── DTO/              # Data transfer objects
│   ├── entity/           # JPA entities (8 entities)
│   ├── repository/       # JPA repositories (6 repos)
│   └── Service/          # Business logic (7 services)
├── src/main/resources/
│   ├── application.properties
│   ├── static/           # Frontend files (HTML/CSS/JS)
│   │   ├── dashboard.html
│   │   ├── stocks.html
│   │   ├── portfolio.html
│   │   └── ...
│   └── application.properties.example
├── pom.xml
└── README.md
```

---

## 📝 License

**MIT License** - Free for learning and commercial use.

---

## 👨‍💻 Author

**Krishna Goyal**

[![GitHub](https://img.shields.io/badge/GitHub-krishgoyal0-181717?logo=github)](https://github.com/krishgoyal0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Krishna%20Goyal-0077B5?logo=linkedin)](https://linkedin.com/in/krishgoyal0)

---

## ⭐ Show Your Support

If this project helped you learn, please give it a ⭐ on GitHub!

---

*Built as a portfolio project to demonstrate full-stack development skills with Spring Boot, WebSocket, and real-world API integration.*

**Live Demo URL:** *[Coming soon after deployment]*
```

---

## Key Improvements Made:

| Area | Before | After |
|------|--------|-------|
| **Visual** | Plain text | Badges, emojis, tables |
| **Structure** | Basic | Clear sections with icons |
| **Architecture** | Text only | ASCII diagram |
| **API docs** | List | Table format + curl examples |
| **Setup** | Basic steps | Complete with commands |
| **Project structure** | Missing | Tree view |
| **Professionalism** | Good | **Recruiter-ready** |

---

**This README will make recruiters stop and read. Copy-paste it to your GitHub!** 🚀
