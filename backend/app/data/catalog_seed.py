CATALOG = [
    {
        "category": {
            "name": "Laptops",
            "slug": "laptops",
        },
        "products": [
            {
                "brand": {"name": "Lenovo", "slug": "lenovo"},
                "name": "Lenovo IdeaPad Slim 5",
                "slug": "lenovo-ideapad-slim-5",
                "description": (
                    "Balanced laptop for productivity, programming, "
                    "study and everyday work."
                ),
                "score": 91,
                "score_explanation": (
                    "Strong balance of performance, battery life, "
                    "portability and build quality."
                ),
                "price": "849.99",
                "specifications": [
                    ("Processor", "AMD Ryzen 7", "Performance"),
                    ("Memory", "16 GB RAM", "Performance"),
                    ("Storage", "512 GB SSD", "Storage"),
                    ("Display", "14-inch IPS", "Display"),
                    ("Battery life", "Up to 12 hours", "Battery"),
                    ("Weight", "1.46 kg", "Design"),
                    ("Best for", "Programming and productivity", "Usage"),
                ],
            },
            {
                "brand": {"name": "Dell", "slug": "dell"},
                "name": "Dell Inspiron 14",
                "slug": "dell-inspiron-14",
                "description": (
                    "Reliable everyday laptop with strong productivity "
                    "performance and practical portability."
                ),
                "score": 88,
                "score_explanation": (
                    "Reliable performance and good value for everyday "
                    "productivity."
                ),
                "price": "799.99",
                "specifications": [
                    ("Processor", "Intel Core i5", "Performance"),
                    ("Memory", "16 GB RAM", "Performance"),
                    ("Storage", "512 GB SSD", "Storage"),
                    ("Display", "14-inch Full HD", "Display"),
                    ("Battery life", "Up to 10 hours", "Battery"),
                    ("Weight", "1.54 kg", "Design"),
                    ("Best for", "Office work and study", "Usage"),
                ],
            },
            {
                "brand": {"name": "ASUS", "slug": "asus"},
                "name": "ASUS Vivobook 15",
                "slug": "asus-vivobook-15",
                "description": (
                    "Affordable general-purpose laptop for students, "
                    "browsing and everyday applications."
                ),
                "score": 84,
                "score_explanation": (
                    "Affordable option with suitable specifications "
                    "for general use."
                ),
                "price": "699.99",
                "specifications": [
                    ("Processor", "AMD Ryzen 5", "Performance"),
                    ("Memory", "8 GB RAM", "Performance"),
                    ("Storage", "512 GB SSD", "Storage"),
                    ("Display", "15.6-inch Full HD", "Display"),
                    ("Battery life", "Up to 8 hours", "Battery"),
                    ("Weight", "1.70 kg", "Design"),
                    ("Best for", "Students and general use", "Usage"),
                ],
            },
            {
                "brand": {"name": "Apple", "slug": "apple"},
                "name": "MacBook Air 13",
                "slug": "macbook-air-13",
                "image_url": "/products/macbook-air-13/01.webp",
                "images": [
                    {
                        "image_url": "/products/macbook-air-13/01.webp",
                        "alt_text": "MacBook Air 13",
                        "position": 1,
                        "is_primary": True,
                    },
                    {
                        "image_url": "/products/macbook-air-13/02.webp",
                        "alt_text": "MacBook Air 13 alternate view",
                        "position": 2,
                        "is_primary": False,
                    },
                    {
                        "image_url": "/products/macbook-air-13/03.webp",
                        "alt_text": "MacBook Air 13 detail view",
                        "position": 3,
                        "is_primary": False,
                    },
                    {
                        "image_url": "/products/macbook-air-13/04.webp",
                        "alt_text": "MacBook Air 13 additional view",
                        "position": 4,
                        "is_primary": False,
                    },
                ],
                "description": (
                    "Thin and lightweight laptop focused on battery life, "
                    "portability and smooth everyday performance."
                ),
                "score": 94,
                "score_explanation": (
                    "Excellent portability, battery efficiency and "
                    "overall user experience."
                ),
                "price": "1099.00",
                "specifications": [
                    ("Processor", "Apple Silicon", "Performance"),
                    ("Memory", "16 GB unified memory", "Performance"),
                    ("Storage", "512 GB SSD", "Storage"),
                    ("Display", "13-inch Retina-class display", "Display"),
                    ("Battery life", "All-day battery", "Battery"),
                    ("Best for", "Travel and productivity", "Usage"),
                ],
            },
            {
                "brand": {"name": "HP", "slug": "hp"},
                "name": "HP Pavilion Plus 14",
                "slug": "hp-pavilion-plus-14",
                "description": (
                    "Versatile laptop designed for work, study and "
                    "multimedia use."
                ),
                "score": 87,
                "score_explanation": (
                    "Good balance between display quality, performance "
                    "and portability."
                ),
                "price": "899.99",
                "specifications": [
                    ("Processor", "Intel Core Ultra 5", "Performance"),
                    ("Memory", "16 GB RAM", "Performance"),
                    ("Storage", "512 GB SSD", "Storage"),
                    ("Display", "14-inch display", "Display"),
                    ("Best for", "Work and multimedia", "Usage"),
                ],
            },
        ],
    },
    {
        "category": {
            "name": "Smartphones",
            "slug": "smartphones",
        },
        "products": [
            {
                "brand": {"name": "Apple", "slug": "apple"},
                "name": "iPhone 16",
                "slug": "iphone-16",
                "description": (
                    "Premium smartphone focused on camera quality, "
                    "performance and long-term software support."
                ),
                "score": 93,
                "score_explanation": (
                    "Strong camera system, performance and ecosystem."
                ),
                "price": "799.00",
                "specifications": [
                    ("Display", "OLED display", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "5G", "Connectivity"),
                    ("Best for", "Photography and everyday premium use", "Usage"),
                ],
            },
            {
                "brand": {"name": "Samsung", "slug": "samsung"},
                "name": "Samsung Galaxy S25",
                "slug": "samsung-galaxy-s25",
                "description": (
                    "High-end Android smartphone with strong display, "
                    "camera and multitasking capabilities."
                ),
                "score": 92,
                "score_explanation": (
                    "Excellent display and versatile Android experience."
                ),
                "price": "799.99",
                "specifications": [
                    ("Display", "AMOLED display", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "5G", "Connectivity"),
                    ("Best for", "Android power users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Google", "slug": "google"},
                "name": "Google Pixel 9",
                "slug": "google-pixel-9",
                "description": (
                    "Android smartphone emphasizing computational "
                    "photography and clean software."
                ),
                "score": 90,
                "score_explanation": (
                    "Excellent photography and streamlined Android software."
                ),
                "price": "699.00",
                "specifications": [
                    ("Display", "OLED display", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "5G", "Connectivity"),
                    ("Best for", "Photography and Google services", "Usage"),
                ],
            },
            {
                "brand": {"name": "OnePlus", "slug": "oneplus"},
                "name": "OnePlus 13",
                "slug": "oneplus-13",
                "description": (
                    "Performance-oriented Android smartphone with "
                    "fast charging and fluid software."
                ),
                "score": 89,
                "score_explanation": (
                    "Strong performance and charging speed for the price."
                ),
                "price": "699.99",
                "specifications": [
                    ("Display", "AMOLED display", "Display"),
                    ("Storage", "256 GB", "Storage"),
                    ("Connectivity", "5G", "Connectivity"),
                    ("Best for", "Performance-focused users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Xiaomi", "slug": "xiaomi"},
                "name": "Xiaomi 15",
                "slug": "xiaomi-15",
                "description": (
                    "Feature-rich smartphone balancing performance, "
                    "camera capabilities and value."
                ),
                "score": 88,
                "score_explanation": (
                    "Competitive specifications and strong overall value."
                ),
                "price": "649.99",
                "specifications": [
                    ("Display", "AMOLED display", "Display"),
                    ("Storage", "256 GB", "Storage"),
                    ("Connectivity", "5G", "Connectivity"),
                    ("Best for", "Value-focused power users", "Usage"),
                ],
            },
        ],
    },

    {
        "category": {
            "name": "Headphones",
            "slug": "headphones",
        },
        "products": [
            {
                "brand": {"name": "Sony", "slug": "sony"},
                "name": "Sony WH-1000XM5",
                "slug": "sony-wh-1000xm5",
                "description": "Premium wireless headphones focused on comfort, noise cancellation and travel.",
                "image_url": "/products/sony-wh-1000xm5/01.webp",
                "images": [
                    {
                        "image_url": "/products/sony-wh-1000xm5/01.webp",
                        "alt_text": "Sony WH-1000XM5 headphones",
                        "position": 1,
                        "is_primary": True,
                    },
                    {
                        "image_url": "/products/sony-wh-1000xm5/02.webp",
                        "alt_text": "Sony WH-1000XM5 headphones alternate view",
                        "position": 2,
                        "is_primary": False,
                    },
                    {
                        "image_url": "/products/sony-wh-1000xm5/03.webp",
                        "alt_text": "Sony WH-1000XM5 headphones detail view",
                        "position": 3,
                        "is_primary": False,
                    },
                    {
                        "image_url": "/products/sony-wh-1000xm5/04.webp",
                        "alt_text": "Sony WH-1000XM5 headphones additional view",
                        "position": 4,
                        "is_primary": False,
                    },
                ],
                "score": 94,
                "score_explanation": "Excellent noise cancellation, comfort and balanced sound.",
                "price": "399.99",
                "specifications": [
                    ("Type", "Over-ear wireless", "Design"),
                    ("Noise cancellation", "Active noise cancellation", "Audio"),
                    ("Connectivity", "Bluetooth", "Connectivity"),
                    ("Best for", "Travel and focused work", "Usage"),
                ],
            },
            {
                "brand": {"name": "Bose", "slug": "bose"},
                "name": "Bose QuietComfort Ultra",
                "slug": "bose-quietcomfort-ultra",
                "description": "Comfort-focused premium headphones with strong active noise cancellation.",
                "score": 93,
                "score_explanation": "Outstanding comfort and strong noise isolation.",
                "price": "429.00",
                "specifications": [
                    ("Type", "Over-ear wireless", "Design"),
                    ("Noise cancellation", "Active noise cancellation", "Audio"),
                    ("Connectivity", "Bluetooth", "Connectivity"),
                    ("Best for", "Long flights and office use", "Usage"),
                ],
            },
            {
                "brand": {"name": "Apple", "slug": "apple"},
                "name": "AirPods Max",
                "slug": "airpods-max",
                "description": "Premium over-ear headphones designed for Apple ecosystem users.",
                "score": 90,
                "score_explanation": "Strong sound, spatial audio and ecosystem integration.",
                "price": "549.00",
                "specifications": [
                    ("Type", "Over-ear wireless", "Design"),
                    ("Noise cancellation", "Active noise cancellation", "Audio"),
                    ("Connectivity", "Bluetooth", "Connectivity"),
                    ("Best for", "Apple ecosystem users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Sennheiser", "slug": "sennheiser"},
                "name": "Sennheiser Momentum 4",
                "slug": "sennheiser-momentum-4",
                "description": "Wireless headphones emphasizing battery life and detailed sound.",
                "score": 91,
                "score_explanation": "Excellent battery life and detailed audio quality.",
                "price": "349.95",
                "specifications": [
                    ("Type", "Over-ear wireless", "Design"),
                    ("Battery life", "Up to 60 hours", "Battery"),
                    ("Connectivity", "Bluetooth", "Connectivity"),
                    ("Best for", "Music and long battery life", "Usage"),
                ],
            },
            {
                "brand": {"name": "JBL", "slug": "jbl"},
                "name": "JBL Tour One M2",
                "slug": "jbl-tour-one-m2",
                "description": "Versatile wireless headphones with adaptive noise cancellation.",
                "score": 86,
                "score_explanation": "Good feature set and strong everyday value.",
                "price": "299.95",
                "specifications": [
                    ("Type", "Over-ear wireless", "Design"),
                    ("Noise cancellation", "Adaptive ANC", "Audio"),
                    ("Connectivity", "Bluetooth", "Connectivity"),
                    ("Best for", "Everyday listening", "Usage"),
                ],
            },
        ],
    },
    {
        "category": {
            "name": "Tablets",
            "slug": "tablets",
        },
        "products": [
            {
                "brand": {"name": "Apple", "slug": "apple"},
                "name": "iPad Air",
                "slug": "ipad-air",
                "description": "Versatile tablet for productivity, creativity and entertainment.",
                "score": 94,
                "score_explanation": "Excellent performance, app ecosystem and portability.",
                "price": "599.00",
                "specifications": [
                    ("Display", "Liquid Retina", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "Wi-Fi", "Connectivity"),
                    ("Best for", "Productivity and creativity", "Usage"),
                ],
            },
            {
                "brand": {"name": "Samsung", "slug": "samsung"},
                "name": "Samsung Galaxy Tab S10 Plus",
                "slug": "samsung-galaxy-tab-s10-plus",
                "description": "Premium Android tablet with a large display and productivity features.",
                "score": 92,
                "score_explanation": "Strong display, multitasking and Android flexibility.",
                "price": "999.99",
                "specifications": [
                    ("Display", "AMOLED", "Display"),
                    ("Storage", "256 GB", "Storage"),
                    ("Connectivity", "Wi-Fi", "Connectivity"),
                    ("Best for", "Multitasking and media", "Usage"),
                ],
            },
            {
                "brand": {"name": "Lenovo", "slug": "lenovo"},
                "name": "Lenovo Tab P12",
                "slug": "lenovo-tab-p12",
                "description": "Large-screen tablet for study, media and general productivity.",
                "score": 85,
                "score_explanation": "Good screen size and value for everyday tablet use.",
                "price": "349.99",
                "specifications": [
                    ("Display", "12.7-inch", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "Wi-Fi", "Connectivity"),
                    ("Best for", "Study and entertainment", "Usage"),
                ],
            },
            {
                "brand": {"name": "Google", "slug": "google"},
                "name": "Google Pixel Tablet",
                "slug": "google-pixel-tablet",
                "description": "Android tablet designed around Google services and home integration.",
                "score": 84,
                "score_explanation": "Clean software and useful Google ecosystem integration.",
                "price": "499.00",
                "specifications": [
                    ("Display", "10.95-inch", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "Wi-Fi", "Connectivity"),
                    ("Best for", "Google ecosystem users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Xiaomi", "slug": "xiaomi"},
                "name": "Xiaomi Pad 7",
                "slug": "xiaomi-pad-7",
                "description": "Value-oriented tablet balancing display quality and performance.",
                "score": 86,
                "score_explanation": "Strong specifications for the price.",
                "price": "399.99",
                "specifications": [
                    ("Display", "High refresh rate display", "Display"),
                    ("Storage", "128 GB", "Storage"),
                    ("Connectivity", "Wi-Fi", "Connectivity"),
                    ("Best for", "Value-focused users", "Usage"),
                ],
            },
        ],
    },
    {
        "category": {
            "name": "Monitors",
            "slug": "monitors",
        },
        "products": [
            {
                "brand": {"name": "Dell", "slug": "dell"},
                "name": "Dell UltraSharp U2723QE",
                "slug": "dell-ultrasharp-u2723qe",
                "description": "Professional 4K monitor for productivity and content work.",
                "score": 93,
                "score_explanation": "Excellent productivity features, sharp image and connectivity.",
                "price": "579.99",
                "specifications": [
                    ("Size", "27-inch", "Display"),
                    ("Resolution", "3840x2160", "Display"),
                    ("Panel", "IPS", "Display"),
                    ("Best for", "Professional productivity", "Usage"),
                ],
            },
            {
                "brand": {"name": "LG", "slug": "lg"},
                "name": "LG UltraGear 27GR93U",
                "slug": "lg-ultragear-27gr93u",
                "description": "High-refresh 4K gaming monitor for smooth gameplay.",
                "score": 91,
                "score_explanation": "Strong gaming performance and sharp 4K image.",
                "price": "599.99",
                "specifications": [
                    ("Size", "27-inch", "Display"),
                    ("Resolution", "3840x2160", "Display"),
                    ("Refresh rate", "144 Hz", "Performance"),
                    ("Best for", "Gaming", "Usage"),
                ],
            },
            {
                "brand": {"name": "ASUS", "slug": "asus"},
                "name": "ASUS ProArt PA278QV",
                "slug": "asus-proart-pa278qv",
                "description": "Color-focused monitor for creative and professional workloads.",
                "score": 89,
                "score_explanation": "Good color accuracy and professional value.",
                "price": "299.99",
                "specifications": [
                    ("Size", "27-inch", "Display"),
                    ("Resolution", "2560x1440", "Display"),
                    ("Panel", "IPS", "Display"),
                    ("Best for", "Photo and design work", "Usage"),
                ],
            },
            {
                "brand": {"name": "Samsung", "slug": "samsung"},
                "name": "Samsung Odyssey G7",
                "slug": "samsung-odyssey-g7",
                "description": "Gaming monitor designed for high refresh rates and immersive play.",
                "score": 88,
                "score_explanation": "Strong refresh rate and gaming-oriented features.",
                "price": "449.99",
                "specifications": [
                    ("Size", "27-inch", "Display"),
                    ("Resolution", "2560x1440", "Display"),
                    ("Refresh rate", "240 Hz", "Performance"),
                    ("Best for", "Competitive gaming", "Usage"),
                ],
            },
            {
                "brand": {"name": "BenQ", "slug": "benq"},
                "name": "BenQ PD2705Q",
                "slug": "benq-pd2705q",
                "description": "Creator-focused monitor with practical professional connectivity.",
                "score": 87,
                "score_explanation": "Reliable creative workflow features and solid color performance.",
                "price": "399.99",
                "specifications": [
                    ("Size", "27-inch", "Display"),
                    ("Resolution", "2560x1440", "Display"),
                    ("Panel", "IPS", "Display"),
                    ("Best for", "Design and office work", "Usage"),
                ],
            },
        ],
    },
    {
        "category": {
            "name": "Smartwatches",
            "slug": "smartwatches",
        },
        "products": [
            {
                "brand": {"name": "Apple", "slug": "apple"},
                "name": "Apple Watch Series 10",
                "slug": "apple-watch-series-10",
                "description": "Smartwatch focused on health, fitness and iPhone integration.",
                "score": 94,
                "score_explanation": "Excellent health features and ecosystem integration.",
                "price": "399.00",
                "specifications": [
                    ("Connectivity", "Bluetooth and Wi-Fi", "Connectivity"),
                    ("Health", "Heart rate and activity tracking", "Health"),
                    ("Compatibility", "iPhone", "Compatibility"),
                    ("Best for", "iPhone users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Samsung", "slug": "samsung"},
                "name": "Samsung Galaxy Watch 7",
                "slug": "samsung-galaxy-watch-7",
                "description": "Android smartwatch with fitness tracking and smart features.",
                "score": 91,
                "score_explanation": "Strong Android integration and health tracking.",
                "price": "299.99",
                "specifications": [
                    ("Connectivity", "Bluetooth and Wi-Fi", "Connectivity"),
                    ("Health", "Fitness and sleep tracking", "Health"),
                    ("Compatibility", "Android", "Compatibility"),
                    ("Best for", "Android users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Google", "slug": "google"},
                "name": "Google Pixel Watch 3",
                "slug": "google-pixel-watch-3",
                "description": "Wear OS smartwatch combining Google services and fitness tracking.",
                "score": 89,
                "score_explanation": "Clean Wear OS experience and strong Google integration.",
                "price": "349.99",
                "specifications": [
                    ("Connectivity", "Bluetooth and Wi-Fi", "Connectivity"),
                    ("Health", "Fitness tracking", "Health"),
                    ("Compatibility", "Android", "Compatibility"),
                    ("Best for", "Google ecosystem users", "Usage"),
                ],
            },
            {
                "brand": {"name": "Garmin", "slug": "garmin"},
                "name": "Garmin Venu 3",
                "slug": "garmin-venu-3",
                "description": "Fitness-focused smartwatch with strong battery life and health metrics.",
                "score": 92,
                "score_explanation": "Excellent fitness tracking and battery life.",
                "price": "449.99",
                "specifications": [
                    ("Health", "Advanced fitness metrics", "Health"),
                    ("Battery life", "Multi-day battery", "Battery"),
                    ("Compatibility", "Android and iOS", "Compatibility"),
                    ("Best for", "Fitness and sports", "Usage"),
                ],
            },
            {
                "brand": {"name": "OnePlus", "slug": "oneplus"},
                "name": "OnePlus Watch 2",
                "slug": "oneplus-watch-2",
                "description": "Wear OS smartwatch emphasizing battery life and everyday performance.",
                "score": 86,
                "score_explanation": "Good battery life and value for Android users.",
                "price": "299.99",
                "specifications": [
                    ("Connectivity", "Bluetooth and Wi-Fi", "Connectivity"),
                    ("Battery life", "Multi-day battery", "Battery"),
                    ("Compatibility", "Android", "Compatibility"),
                    ("Best for", "Everyday Android use", "Usage"),
                ],
            },
        ],
    },

]
