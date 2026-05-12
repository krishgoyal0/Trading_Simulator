# Trading Simulator Backend

A production-grade trading simulator backend with real-time stock prices, portfolio tracking, and REST APIs. Built with Spring Boot and integrated with Finnhub API for live market data.

## 🚀 Features

### Core Trading Features
- **User Management** - Registration, soft delete, reactivation
- **Wallet System** - Add money, check balance, transaction history
- **Live Stock Trading** - Buy/Sell stocks with real-time prices
- **Portfolio Tracking** - Automatic position updates, average price calculation
- **Order History** - Complete trade history for every user
- **Net Worth Calculation** - Real-time cash + stock portfolio valuation

### Technical Highlights
- **Real-time Market Data** - Integrated with Finnhub API (60 calls/minute free tier)
- **Auto Price Updates** - Stock prices refresh every 30 seconds
- **24/7 Crypto Support** - Bitcoin, Ethereum, and major cryptocurrencies
- **REST APIs** - 20+ endpoints ready for frontend integration
- **MySQL Database** - Full ACID compliance with JPA/Hibernate

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Core language |
| Spring Boot 3.2 | Application framework |
| Spring Data JPA | Database ORM |
| MySQL | Relational database |
| Maven | Build automation |
| Finnhub API | Live stock/crypto prices |

## 📦 API Endpoints

### User APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register?name=&email=&password=` | Register new user |
| GET | `/api/users/{id}` | Get user by ID |
| DELETE | `/api/users/{id}` | Soft delete user |
| PUT | `/api/users/{id}` | Reactivate user |

### Wallet APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wallet/add?userId=&amount=` | Add money to wallet |
| GET | `/api/wallet/{userId}/balance` | Check wallet balance |

### Trading APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trading/buy?userId=&stockId=&quantity=` | Buy stocks |
| POST | `/api/trading/sell?userId=&stockId=&quantity=` | Sell stocks |

### Portfolio APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/{userId}` | Get all holdings |
| GET | `/api/portfolio/{userId}/value` | Stock portfolio value |
| GET | `/api/portfolio/{userId}/networth` | Cash + stocks total |

### Stock APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | List all available stocks |
| GET | `/api/stocks/{id}` | Get stock by ID |
| GET | `/api/stocks/symbol/{symbol}` | Search by symbol |
| POST | `/api/stocks/add?name=&symbol=&price=` | Add new stock |
| PUT | `/api/stocks/{id}/price?newPrice=` | Update stock price |
| DELETE | `/api/stocks/{id}` | Remove stock |

### Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/user/{userId}` | User order history |
| GET | `/api/orders/{orderId}` | Get order by ID |

## 🏗️ System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Controller │────▶│   Service   │
│  (Frontend) │◀────│    Layer    │◀────│    Layer    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │ Repository  │
                                         │    Layer    │
                                         └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │   MySQL     │
                                         │  Database   │
                                         └─────────────┘
```

**Data Flow:**
- External API (Finnhub) → Scheduler → Stock prices update every 30 seconds
- User actions → Controllers → Services → Database

## 🚦 Supported Assets

### US Stocks (19)
AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, NFLX, JPM, V, JNJ, WMT, PG, COST, HD, DIS, PEP, KO, MCD

### Cryptocurrencies
BTC/USDT, ETH/USDT, DOGE/USDT, ADA/USDT, SOL/USDT

## 🔧 Installation & Setup

### Prerequisites
- Java 17
- MySQL 8.0+
- Maven
- Finnhub API key (free from finnhub.io)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/krishgoyal0/Trading_Simulator.git
cd Trading_Simulator/trading_sim_backend
```

2. **Configure database**
```sql
CREATE DATABASE trading_db;
```

3. **Configure application properties**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
Edit `application.properties` with your:
- MySQL username/password
- Finnhub API key

4. **Build and run**
```bash
mvn clean install
mvn spring-boot:run
```

5. **Access the application**
```
Base URL: http://localhost:8080
```

## 📊 Sample API Usage (Postman)

### Register a user
```
POST http://localhost:8080/api/users/register?name=John&email=john@test.com&password=123
```

### Add money to wallet
```
POST http://localhost:8080/api/wallet/add?userId=1&amount=10000
```

### Buy stocks
```
POST http://localhost:8080/api/trading/buy?userId=1&stockId=1&quantity=10
```

### Check portfolio
```
GET http://localhost:8080/api/portfolio/1/networth
```

## 🔄 Price Update Mechanism

- **Schedule**: Every 30 seconds
- **API Rate Limit**: 60 calls/minute (Finnhub free tier)
- **US Stocks**: 19 stocks × 1 call = 19 calls per update
- **Market Hours**: Updates only when market is open (7 PM - 1:30 AM IST)
- **Cryptocurrency**: 24/7 updates

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts with soft delete |
| `wallets` | User balances |
| `stock` | Available stocks with live prices |
| `orders` | Buy/Sell trade records |
| `transactions` | Money movement history |
| `portfolios` | Current stock holdings per user |

## 🧪 Testing

Run the application and use Postman for API testing. All endpoints return JSON responses.

## 🚧 Future Enhancements

- [ ] Real-time WebSocket price streaming
- [ ] Candlestick charts
- [ ] Price alerts
- [ ] Paper trading mode
- [ ] React frontend dashboard
- [ ] Docker containerization
- [ ] JWT authentication

## 📝 License

MIT License - Free for learning and commercial use

## 👨‍💻 Author

**Krishna Goyal**
- GitHub: [@krishgoyal0](https://github.com/krishgoyal0)

---

*Built as a portfolio project to demonstrate backend development skills with SpringBoot and real-world API integration.*