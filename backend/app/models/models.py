from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    avg_txn_amount = Column(Float, default=4300.0)
    normal_start_time = Column(String, default="08:00")
    normal_end_time = Column(String, default="23:00")
    account_status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="customer")
    risk_events = relationship("RiskEvent", back_populates="customer")


class Merchant(Base):
    __tablename__ = "merchants"

    merchant_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    risk_level = Column(String, default="MEDIUM")
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="merchant")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.customer_id"), nullable=False)
    merchant_id = Column(String, ForeignKey("merchants.merchant_id"), nullable=True)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="COMPLETED")  # e.g., SUSPICIOUS, COMPLETED, FLAGGED
    risk_score = Column(Float, default=0.0)  # e.g., 87.0
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=True)
    channel = Column(String, default="ONLINE")  # ONLINE, ATM, POS
    recipient_account = Column(String, nullable=True)

    customer = relationship("Customer", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")
    risk_events = relationship("RiskEvent", back_populates="transaction")


class RiskEvent(Base):
    __tablename__ = "risk_events"

    event_id = Column(String, primary_key=True, index=True)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.customer_id"), nullable=False)
    event_type = Column(String, nullable=False)  # HIGH_AMOUNT, UNUSUAL_TIME, UNSEEN_MERCHANT, RAPID_TRANSFERS
    severity = Column(String, default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="risk_events")
    customer = relationship("Customer", back_populates="risk_events")
