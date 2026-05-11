import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import engine, SessionLocal, Base
from app.models.part import Part, Pricing, PartType


# Create all tables
Base.metadata.create_all(bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

PARTS = [
    # CPUs
    {
        "name": "AMD Ryzen 5 7600X",
        "brand": "AMD",
        "category": "cpu",
        "specs": {"socket": "AM5", "cores": 6, "threads": 12, "tdp": 105},
        "price": 229,
        "image_url": "https://m.media-amazon.com/images/I/51dXdMHfFuL._AC_SX679_.jpg",
    },
    {
        "name": "Intel Core i5-13600K",
        "brand": "Intel",
        "category": "cpu",
        "specs": {"socket": "LGA1700", "cores": 14, "threads": 20, "tdp": 125},
        "price": 289,
        "image_url": "https://m.media-amazon.com/images/I/61o4yjWsimL._AC_SX679_.jpg",
    },
    {
        "name": "AMD Ryzen 9 7950X",
        "brand": "AMD",
        "category": "cpu",
        "specs": {"socket": "AM5", "cores": 16, "threads": 32, "tdp": 170},
        "price": 549,
        "image_url": "https://m.media-amazon.com/images/I/51dXdMHfFuL._AC_SX679_.jpg",
    },
    {
        "name": "Intel Core i3-12100",
        "brand": "Intel",
        "category": "cpu",
        "specs": {"socket": "LGA1700", "cores": 4, "threads": 8, "tdp": 60},
        "price": 99,
        "image_url": "https://m.media-amazon.com/images/I/61o4yjWsimL._AC_SX679_.jpg",
    },
    # GPUs
    {
        "name": "NVIDIA RTX 4070",
        "brand": "NVIDIA",
        "category": "gpu",
        "specs": {"vram": 12, "vram_type": "GDDR6X", "tdp": 200},
        "price": 549,
        "image_url": "https://m.media-amazon.com/images/I/81pg1WNbMML._AC_SX679_.jpg",
    },
    {
        "name": "AMD RX 7800 XT",
        "brand": "AMD",
        "category": "gpu",
        "specs": {"vram": 16, "vram_type": "GDDR6", "tdp": 263},
        "price": 449,
        "image_url": "https://m.media-amazon.com/images/I/81U7EjPkBwL._AC_SX679_.jpg",
    },
    {
        "name": "NVIDIA RTX 4090",
        "brand": "NVIDIA",
        "category": "gpu",
        "specs": {"vram": 24, "vram_type": "GDDR6X", "tdp": 450},
        "price": 1599,
        "image_url": "https://m.media-amazon.com/images/I/81pg1WNbMML._AC_SX679_.jpg",
    },
    {
        "name": "NVIDIA RTX 4060",
        "brand": "NVIDIA",
        "category": "gpu",
        "specs": {"vram": 8, "vram_type": "GDDR6", "tdp": 115},
        "price": 299,
        "image_url": "https://m.media-amazon.com/images/I/81pg1WNbMML._AC_SX679_.jpg",
    },
    # Motherboards
    {
        "name": "ASUS ROG Strix X670E-F",
        "brand": "ASUS",
        "category": "motherboard",
        "specs": {"socket": "AM5", "form_factor": "ATX", "supported_ram": "DDR5"},
        "price": 349,
        "image_url": "https://m.media-amazon.com/images/I/81q7cVPRYkL._AC_SX679_.jpg",
    },
    {
        "name": "MSI MAG B650 TOMAHAWK",
        "brand": "MSI",
        "category": "motherboard",
        "specs": {"socket": "AM5", "form_factor": "ATX", "supported_ram": "DDR5"},
        "price": 199,
        "image_url": "https://m.media-amazon.com/images/I/81FMpEkxQGL._AC_SX679_.jpg",
    },
    {
        "name": "Gigabyte Z790 AORUS Elite",
        "brand": "Gigabyte",
        "category": "motherboard",
        "specs": {"socket": "LGA1700", "form_factor": "ATX", "supported_ram": "DDR5"},
        "price": 279,
        "image_url": "https://m.media-amazon.com/images/I/81q7cVPRYkL._AC_SX679_.jpg",
    },
    {
        "name": "ASRock B760M Pro RS",
        "brand": "ASRock",
        "category": "motherboard",
        "specs": {"socket": "LGA1700", "form_factor": "mATX", "supported_ram": "DDR4"},
        "price": 129,
        "image_url": "https://m.media-amazon.com/images/I/81FMpEkxQGL._AC_SX679_.jpg",
    },
    # RAM
    {
        "name": "G.Skill Trident Z5 32GB DDR5-6000",
        "brand": "G.Skill",
        "category": "ram",
        "specs": {"capacity_gb": 32, "type": "DDR5", "speed": 6000},
        "price": 119,
        "image_url": "https://m.media-amazon.com/images/I/61oSBPwLKLL._AC_SX679_.jpg",
    },
    {
        "name": "Corsair Vengeance 16GB DDR4-3200",
        "brand": "Corsair",
        "category": "ram",
        "specs": {"capacity_gb": 16, "type": "DDR4", "speed": 3200},
        "price": 49,
        "image_url": "https://m.media-amazon.com/images/I/61vCQgFPPaL._AC_SX679_.jpg",
    },
    {
        "name": "Kingston Fury Beast 32GB DDR5-5200",
        "brand": "Kingston",
        "category": "ram",
        "specs": {"capacity_gb": 32, "type": "DDR5", "speed": 5200},
        "price": 89,
        "image_url": "https://m.media-amazon.com/images/I/61oSBPwLKLL._AC_SX679_.jpg",
    },
    # Storage
    {
        "name": "Samsung 990 Pro 1TB NVMe",
        "brand": "Samsung",
        "category": "storage",
        "specs": {"capacity_gb": 1000, "interface": "NVMe", "read_mbps": 7450},
        "price": 109,
        "image_url": "https://m.media-amazon.com/images/I/61GmXDDFGHL._AC_SX679_.jpg",
    },
    {
        "name": "WD Black SN850X 2TB",
        "brand": "WD",
        "category": "storage",
        "specs": {"capacity_gb": 2000, "interface": "NVMe", "read_mbps": 7300},
        "price": 179,
        "image_url": "https://m.media-amazon.com/images/I/61GmXDDFGHL._AC_SX679_.jpg",
    },
    {
        "name": "Crucial MX500 1TB SATA SSD",
        "brand": "Crucial",
        "category": "storage",
        "specs": {"capacity_gb": 1000, "interface": "SATA", "read_mbps": 560},
        "price": 59,
        "image_url": "https://m.media-amazon.com/images/I/71Le-3yxKQL._AC_SX679_.jpg",
    },
    # PSUs
    {
        "name": "Corsair RM850x 850W 80+ Gold",
        "brand": "Corsair",
        "category": "psu",
        "specs": {"wattage": 850, "efficiency": "80+ Gold", "modular": True},
        "price": 139,
        "image_url": "https://m.media-amazon.com/images/I/61oYC8LOLCL._AC_SX679_.jpg",
    },
    {
        "name": "EVGA SuperNOVA 650 G6",
        "brand": "EVGA",
        "category": "psu",
        "specs": {"wattage": 650, "efficiency": "80+ Gold", "modular": True},
        "price": 89,
        "image_url": "https://m.media-amazon.com/images/I/61oYC8LOLCL._AC_SX679_.jpg",
    },
    {
        "name": "SeaSonic Focus GX-1000",
        "brand": "SeaSonic",
        "category": "psu",
        "specs": {"wattage": 1000, "efficiency": "80+ Gold", "modular": True},
        "price": 179,
        "image_url": "https://m.media-amazon.com/images/I/61oYC8LOLCL._AC_SX679_.jpg",
    },
    {
        "name": "Thermaltake Smart 500W",
        "brand": "Thermaltake",
        "category": "psu",
        "specs": {"wattage": 500, "efficiency": "80+ White", "modular": False},
        "price": 39,
        "image_url": "https://m.media-amazon.com/images/I/61oYC8LOLCL._AC_SX679_.jpg",
    },
    # Cases
    {
        "name": "Fractal Design Meshify 2",
        "brand": "Fractal Design",
        "category": "case",
        "specs": {"form_factor": "ATX", "color": "black"},
        "price": 149,
        "image_url": "https://m.media-amazon.com/images/I/71Pxgq5biML._AC_SX679_.jpg",
    },
    {
        "name": "Lian Li PC-O11 Dynamic EVO",
        "brand": "Lian Li",
        "category": "case",
        "specs": {"form_factor": "ATX", "color": "white"},
        "price": 169,
        "image_url": "https://m.media-amazon.com/images/I/71Pxgq5biML._AC_SX679_.jpg",
    },
    {
        "name": "NZXT H510",
        "brand": "NZXT",
        "category": "case",
        "specs": {"form_factor": "ATX", "color": "black"},
        "price": 79,
        "image_url": "https://m.media-amazon.com/images/I/71Pxgq5biML._AC_SX679_.jpg",
    },
    # Coolers
    {
        "name": "Noctua NH-D15",
        "brand": "Noctua",
        "category": "cooler",
        "specs": {"type": "air", "tdp_supported": 250},
        "price": 99,
        "image_url": "https://m.media-amazon.com/images/I/71FMvTVUAML._AC_SX679_.jpg",
    },
    {
        "name": "Corsair H150i Elite LCD 360mm",
        "brand": "Corsair",
        "category": "cooler",
        "specs": {"type": "aio", "radiator_mm": 360, "tdp_supported": 350},
        "price": 199,
        "image_url": "https://m.media-amazon.com/images/I/71FMvTVUAML._AC_SX679_.jpg",
    },
    {
        "name": "be quiet! Dark Rock 4",
        "brand": "be quiet!",
        "category": "cooler",
        "specs": {"type": "air", "tdp_supported": 200},
        "price": 74,
        "image_url": "https://m.media-amazon.com/images/I/71FMvTVUAML._AC_SX679_.jpg",
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Part).count() > 0:
            print("Database already seeded, skipping.")
            return

        for p in PARTS:
            part = Part(
                name=p["name"],
                brand=p["brand"],
                category=PartType(p["category"]),
                specs=p["specs"],
                image_url=p.get("image_url"),
            )
            db.add(part)
            db.flush()
            pricing = Pricing(
                part_id=part.id,
                price=p["price"],
                in_stock=True,
            )
            db.add(pricing)

        db.commit()
        print(f"Successfully seeded {len(PARTS)} parts!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
