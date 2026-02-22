import asyncio
from app.services.pdf_service import fetch_pdf_from_frontend

async def main():
    data = {
        "project_name": "Test Project",
        "features": [{"name": "Auth", "detail": "Login", "standard_price": 100000, "hybrid_price": 50000}],
        "total_cost": {"standard": 100000, "hybrid": 50000, "message": "Test"}
    }
    pdf = await fetch_pdf_from_frontend(data, client_name="Test Client")
    if pdf:
        print(f"Success! PDF size: {len(pdf)} bytes")
        with open("test.pdf", "wb") as f:
            f.write(pdf)
    else:
        print("Failed to fetch PDF")

asyncio.run(main())
