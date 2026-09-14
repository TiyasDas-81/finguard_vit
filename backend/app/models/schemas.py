from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

# Standard Tool Contract Wrapper Response
class ToolResult(BaseModel):
    tool: str
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Pydantic models for REST APIs
class CustomerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    customer_id: str
    name: str
    email: Optional[str] = None
    avg_txn_amount: float
    normal_transaction_window: str
    account_status: str


class MerchantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    merchant_id: str
    name: str
    category: str
    risk_level: str


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    transaction_id: str
    customer_id: str
    merchant_id: Optional[str] = None
    merchant_name: Optional[str] = None
    amount: float
    status: str
    risk_score: float
    timestamp: datetime
    location: Optional[str] = None
    channel: str
    recipient_account: Optional[str] = None


class AlertResponse(BaseModel):
    transaction_id: str
    customer_id: str
    customer_name: Optional[str] = None
    amount: float
    merchant_name: Optional[str] = None
    time: str
    risk_score: float
    status: str
    reasons: List[str] = []
