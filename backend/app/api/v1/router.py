"""Aggregate all v1 API route modules."""

from fastapi import APIRouter

from app.api.v1.estimate import router as estimate_router
from app.api.v1.health import router as health_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(estimate_router)
