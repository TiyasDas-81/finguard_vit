"""
SQLAlchemy ORM Data Models for FinGuard Financial Investigation System.
Unified Schema supporting SQLite / PostgreSQL, Financial Tools, and API Endpoints.
"""

from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
import datetime

from backend.app.database.session import Base


def utc_now():
    return datetime.datetime.utcnow()


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    avg_txn_amount = Column(Float, default=4300.0)
    normal_start_time = Column(String(20), default="08:00")
    normal_end_time = Column(String(20), default="23:00")
    account_status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=utc_now)

    transactions = relationship("Transaction", back_populates="customer")
    risk_events = relationship("RiskEvent", back_populates="customer")


class Merchant(Base):
    __tablename__ = "merchants"

    merchant_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    risk_level = Column(String(20), default="HIGH")
    created_at = Column(DateTime, default=utc_now)

    transactions = relationship("Transaction", back_populates="merchant")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False, index=True)
    merchant_id = Column(String(50), ForeignKey("merchants.merchant_id"), nullable=True, index=True)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default="COMPLETED")  # COMPLETED, SUSPICIOUS, FLAGGED
    risk_score = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=utc_now)
    location = Column(String(100), nullable=True)
    channel = Column(String(50), default="ONLINE")  # ONLINE, ATM, POS
    recipient_account = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    customer = relationship("Customer", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")
    risk_events = relationship("RiskEvent", back_populates="transaction")


class RiskEvent(Base):
    __tablename__ = "risk_events"

    event_id = Column(String(50), primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"), nullable=False, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # HIGH_AMOUNT, UNUSUAL_TIME, UNSEEN_MERCHANT, RAPID_TRANSFERS
    severity = Column(String(20), default="HIGH")    # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    transaction = relationship("Transaction", back_populates="risk_events")
    customer = relationship("Customer", back_populates="risk_events")
