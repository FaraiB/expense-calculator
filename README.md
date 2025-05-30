# Expense Calculator

A web application for tracking monthly household expenses including utilities, condominium fees, and other regular bills.

## Development Environment

- macOS
- Node.js
- SQLite

## Features

- Track monthly expenses by category:

  - Condomínio (Condominium fees)
  - Plano de Saúde (Health Insurance)
  - Eletricidade (Electricity)
  - Gás (Gas)
  - Internet
  - Celular (Mobile Phone)
  - Credit Card

- Automatic total calculation
- Monthly expense tracking by year/month
- Stored calculations for historical reference
- Simple and intuitive interface
- Comprehensive input validation
- Detailed error messages
- RESTful API with full CRUD operations

## Tech Stack

### Backend

- Node.js
- Express
- SQLite with Sequelize ORM
- Express Validator for input validation
- CORS for cross-origin requests

### Frontend (Coming soon)

- React
- Modern UI components
- Form handling

## Project Structure

```
sqlite-version/
├── backend/
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── models/
│   │   └── Expense.js      # Expense model definition
│   ├── middleware/
│   │   ├── expenseValidation.js  # Input validation
│   │   └── errorHandler.js       # Error handling
│   ├── routes/
│   │   └── expenses.js     # API routes
│   ├── API.md             # API documentation
│   ├── server.js          # Express server setup
│   └── package.json       # Backend dependencies
├── frontend/              # Coming soon
└── README.md
```

## Database Schema

The application uses SQLite with the following schema for expenses:

### Expense Table

| Field           | Type          | Description                          |
| --------------- | ------------- | ------------------------------------ |
| id              | INTEGER       | Primary key, auto-increment          |
| date            | DATE          | Month and year of expenses (YYYY-MM) |
| condominio      | DECIMAL(10,2) | Condominium fee                      |
| planoSaude      | DECIMAL(10,2) | Health insurance cost                |
| eletricidade    | DECIMAL(10,2) | Electricity bill                     |
| gas             | DECIMAL(10,2) | Gas bill                             |
| internet        | DECIMAL(10,2) | Internet bill                        |
| celular         | DECIMAL(10,2) | Mobile phone bill                    |
| creditCard      | DECIMAL(10,2) | Credit card bill                     |
| calculatedTotal | DECIMAL(10,2) | Stored total of all expenses         |
| amountToPay     | DECIMAL(10,2) | Final amount to be paid              |
| createdAt       | DATETIME      | Record creation timestamp            |
| updatedAt       | DATETIME      | Record update timestamp              |

## API Features

- Full CRUD operations for expenses
- Input validation:
  - Date format validation (YYYY-MM)
  - Numeric field validation
  - Required fields checking
- Error handling:
  - Structured error responses
  - Field-specific error messages
  - Different error types (validation, database, server)
- Automatic calculations:
  - Total expense calculation
  - Amount to pay tracking
- Monthly filtering

For detailed API documentation, see [backend/API.md](backend/API.md)

## Setup

1. Clone the repository

```bash
git clone git@github.com:FaraiB/expense-calculator.git
cd expense-calculator/sqlite-version
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Start the server

```bash
cd backend
node server.js
```

The server will start on port 5001 by default.

## Development Status

- [x] Project structure setup
- [x] Database configuration
- [x] Expense model implementation
- [x] API routes implementation
- [x] Input validation
- [x] Error handling
- [x] API documentation
- [ ] Frontend development
- [ ] Testing
- [ ] Deployment

## Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
