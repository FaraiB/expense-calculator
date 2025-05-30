# Expense Calculator API Documentation

## Base URL

`http://localhost:5001/api`

## Endpoints

### Get All Expenses

- **URL:** `/expenses`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of expense objects

```json
[
  {
    "id": 1,
    "date": "2024-01",
    "condominio": 500.0,
    "planoSaude": 300.0,
    "eletricidade": 150.0,
    "gas": 50.0,
    "internet": 100.0,
    "celular": 80.0,
    "creditCard": 1200.0,
    "calculatedTotal": 2380.0,
    "amountToPay": 2380.0
  }
]
```

### Get Expense by ID

- **URL:** `/expenses/:id`
- **Method:** `GET`
- **URL Params:** `id=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:** Single expense object
- **Error Response:**
  - **Code:** 404
  - **Content:** `{ "message": "Expense not found" }`

### Get Expenses by Month

- **URL:** `/expenses/month/:year/:month`
- **Method:** `GET`
- **URL Params:**
  - `year=[integer]` (YYYY format)
  - `month=[integer]` (MM format)
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of expense objects for the specified month

### Create New Expense

- **URL:** `/expenses`
- **Method:** `POST`
- **Data Params:**

```json
{
  "date": "YYYY-MM",
  "condominio": number,
  "planoSaude": number,
  "eletricidade": number,
  "gas": number,
  "internet": number,
  "celular": number,
  "creditCard": number
}
```

- **Success Response:**
  - **Code:** 201
  - **Content:** Created expense object with calculated totals

### Update Expense

- **URL:** `/expenses/:id`
- **Method:** `PUT`
- **URL Params:** `id=[integer]`
- **Data Params:** Same as POST
- **Success Response:**
  - **Code:** 200
  - **Content:** Updated expense object
- **Error Response:**
  - **Code:** 404
  - **Content:** `{ "message": "Expense not found" }`

### Delete Expense

- **URL:** `/expenses/:id`
- **Method:** `DELETE`
- **URL Params:** `id=[integer]`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Expense deleted successfully" }`
- **Error Response:**
  - **Code:** 404
  - **Content:** `{ "message": "Expense not found" }`

## Calculations

The API automatically handles several calculations:

1. **Total (`total`)**: Virtual field that sums all expense fields:

   - condominio
   - planoSaude
   - eletricidade
   - gas
   - internet
   - celular
   - creditCard

2. **Calculated Total (`calculatedTotal`)**: Stored total that's automatically calculated and saved with each expense record.

3. **Amount to Pay (`amountToPay`)**: Defaults to the calculated total when creating a new expense, but can be updated separately if needed.

## Data Validation

All numeric fields (condominio, planoSaude, etc.) must be:

- Non-negative numbers
- Decimal values with up to 2 decimal places
- Default to 0 if not provided

The date field must be:

- In YYYY-MM format
- A valid date
- Required
