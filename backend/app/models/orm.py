"""
SQLAlchemy ORM Data Models for FinGuard Financial Investigation System.
"""

from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
import datetime

from backend.app.database.session import Base


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    risk_rating = Column(String(20), default="LOW")
    historical_avg_monthly_spend = Column(Float, default=4300.0)
    spending_profile = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transactions = relationship("Transaction", back_populates="customer")
    risk_events = relationship("RiskEvent", back_populates="customer")


class Merchant(Base):
    __tablename__ = "merchants"

    merchant_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    risk_tier = Column(String(20), default="LOW")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    merchant = Column(String(100), nullable=False)
    timestamp = Column(String(50), nullable=False)
    status = Column(String(20), default="COMPLETED")  # COMPLETED, SUSPICIOUS, FLAGGED
    type = Column(String(30), default="PURCHASE")     # PURCHASE, TRANSFER, WITHDRAWAL
    recipient = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="transactions")


class RiskEvent(Base):
    __tablename__ = "risk_events"

    event_id = Column(String(50), primary_key=True, index=True)
    transaction_id = Column(String(50), ForeignKey("transactions.transaction_id"), nullable=False, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False, index=True)
    risk_score = Column(Integer, nullable=False)  # 0 to 100
    risk_level = Column(String(20), nullable=False) # HIGH, MEDIUM, LOW
    status = Column(String(30), default="SUSPICIOUS")
    flags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="risk_events")
