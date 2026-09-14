# FinGuard API & Financial Tool Contract Specification

This document defines the strict contract for FinGuard's backend APIs and Financial Tools. It serves as the authoritative interface agreement between the Backend Foundation (`aryan` branch) and Agent/Reasoning/UI modules (`tiyas` and `soumen` branches).

---

## 1. Financial Tools Standard Response Wrapper

Every financial tool in `backend/app/tools/` MUST return a dictionary adhering to the standard JSON structure:

### Success Response Contract
```json
{
    "tool": "<tool_name>",
    "success": true,
    "data": { ... },
    "error": null
}
```

### Error Response Contract
```json
{
    "tool": "<tool_name>",
    "success": false,
    "data": null,
    "error": "Error description string"
}
```

---

## 2. Financial Tools Contract Specification

### 2.1 Transaction History (`transaction_history.py`)
- **Function**: `get_transaction_history(customer_id: str, limit: int = 50)`
- **Tool Name**: `"transaction_history"`
- **Data Structure**:
```json
{
    "tool": "transaction_history",
    "success": true,
    "data": {
        "customer_id": "CUST458",
        "customer_name": "Rahul Sharma",
        "average_transaction": 4300.0,
        "normal_transaction_window": "08:00-23:00",
        "total_transactions": 4,
        "transactions": [
            {
                "transaction_id": "TXN10291",
                "amount": 78000.0,
                "status": "SUSPICIOUS",
                "risk_score": 87.0,
                "timestamp": "2026-09-14T02:17:00",
                "time": "02:17 AM",
                "merchant_id": "MERCH_XYZ",
                "merchant_name": "XYZ Electronics",
                "channel": "ONLINE",
                "recipient_account": "ACC_UNKNOWN_99"
            }
        ]
    },
    "error": null
}
```

### 2.2 Spending Analytics (`spending_analytics.py`)
- **Function**: `analyze_spending(customer_id: str, transaction_id: Optional[str] = None)`
- **Tool Name**: `"spending_analytics"`
- **Data Structure**:
```json
{
    "tool": "spending_analytics",
    "success": true,
    "data": {
        "customer_id": "CUST458",
        "historical_average": 4300.0,
        "target_transaction_amount": 78000.0,
        "highest_transaction_amount": 78000.0,
        "anomaly_multiplier": 18.14,
        "multiplier_description": "18.14x normal historical average",
        "normal_transaction_window": "08:00-23:00",
        "total_transactions_analyzed": 7
    },
    "error": null
}
```

### 2.3 Merchant Analysis (`merchant_analysis.py`)
- **Function**: `analyze_merchant(customer_id: str, merchant_id: str)`
- **Tool Name**: `"merchant_analysis"`
- **Data Structure**:
```json
{
    "tool": "merchant_analysis",
    "success": true,
    "data": {
        "customer_id": "CUST458",
        "merchant_id": "MERCH_XYZ",
        "merchant_name": "XYZ Electronics",
        "merchant_category": "Electronics & Gadgets",
        "prior_transactions_count": 0,
        "is_first_time_merchant": true,
        "risk_flag": "NEW_MERCHANT_FOR_CUSTOMER"
    },
    "error": null
}
```

### 2.4 Related Activity (`related_activity.py`)
- **Function**: `find_related_activity(transaction_id: str, window_minutes: int = 15)`
- **Tool Name**: `"related_activity"`
- **Data Structure**:
```json
{
    "tool": "related_activity",
    "success": true,
    "data": {
        "target_transaction_id": "TXN10291",
        "customer_id": "CUST458",
        "rapid_transfers_count": 3,
        "total_rapid_transfers_amount": 195000.0,
        "time_span_minutes": 5.0,
        "summary": "3 rapid related transfers totaling ₹195,000.00 within approximately 5.0 minutes.",
        "related_transactions": [
            {
                "transaction_id": "TXN10288",
                "amount": 65000.0,
                "timestamp": "2026-09-14T02:10:00",
                "time": "02:10 AM",
                "recipient_account": "ACC_REL_01"
            }
        ]
    },
    "error": null
}
```

### 2.5 Risk Context (`risk_context.py`)
- **Function**: `get_risk_context(customer_id: str)`
- **Tool Name**: `"risk_context"`
- **Data Structure**:
```json
{
    "tool": "risk_context",
    "success": true,
    "data": {
        "customer_id": "CUST458",
        "customer_name": "Rahul Sharma",
        "account_status": "ACTIVE",
        "overall_risk_score": 87.0,
        "historical_average_txn": 4300.0,
        "normal_transaction_window": "08:00-23:00",
        "active_risk_events_count": 4,
        "risk_events": [
            {
                "event_id": "RE_101",
                "transaction_id": "TXN10291",
                "event_type": "HIGH_AMOUNT",
                "severity": "CRITICAL",
                "description": "Transaction amount ₹78,000 is ~18x customer's historical average of ₹4,300."
            }
        ]
    },
    "error": null
}
```

---

## 3. REST API Endpoints

### 3.1 Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
    "status": "ok"
}
```

### 3.2 List Suspicious Alerts
- **Endpoint**: `GET /api/alerts`
- **Response**: `Array<AlertResponse>`
```json
[
    {
        "transaction_id": "TXN10291",
        "customer_id": "CUST458",
        "customer_name": "Rahul Sharma",
        "amount": 78000.0,
        "merchant_name": "XYZ Electronics",
        "time": "02:17 AM",
        "risk_score": 87.0,
        "status": "SUSPICIOUS",
        "reasons": [
            "Transaction amount ₹78,000 is ~18x customer's historical average of ₹4,300.",
            "Transaction occurred at 02:17 AM, outside normal window (08:00 AM - 11:00 PM).",
            "Merchant XYZ Electronics has never been used by CUST458 previously.",
            "Part of 3 rapid related transfers totaling ₹1,95,000 within 7 minutes."
        ]
    }
]
```

### 3.3 Single Alert Details
- **Endpoint**: `GET /api/alerts/{transaction_id}`
- **Response**: `AlertResponse` (Same structure as individual alert object above)

### 3.4 Customer Details
- **Endpoint**: `GET /api/customers/{customer_id}`
- **Response**: `CustomerResponse`
```json
{
    "customer_id": "CUST458",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@example.com",
    "avg_txn_amount": 4300.0,
    "normal_transaction_window": "08:00-23:00",
    "account_status": "ACTIVE"
}
```

### 3.5 Transaction Details
- **Endpoint**: `GET /api/transactions/{transaction_id}`
- **Response**: `TransactionResponse`
```json
{
    "transaction_id": "TXN10291",
    "customer_id": "CUST458",
    "merchant_id": "MERCH_XYZ",
    "merchant_name": "XYZ Electronics",
    "amount": 78000.0,
    "status": "SUSPICIOUS",
    "risk_score": 87.0,
    "timestamp": "2026-09-14T02:17:00",
    "location": "Mumbai, IN",
    "channel": "ONLINE",
    "recipient_account": "ACC_UNKNOWN_99"
}
```
