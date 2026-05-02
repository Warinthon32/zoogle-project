import config
import pyodbc
from datetime import datetime


animal_names = [
    "Snow Leopard", "Bengal Tiger", "Jaguar", "Cheetah",
    "Capybara", "Wolverine", "Komodo Dragon", "Axolotl",
    "Harpy Eagle", "Manta Ray", "Blue-ringed Octopus",
    "Phoenix", "Kirin", "Kraken", "Pegasus", "Unicorn"
]

USE_MOCK_DATA = True

from db import get_db_connection


def initUseMockData():
    if not USE_MOCK_DATA:
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    for name in animal_names:

        # 1. check animal exists
        cursor.execute("SELECT AID FROM Animal WHERE Name = ?", (name,))
        row = cursor.fetchone()

        if not row:
            continue

        animal_id = row[0]

        # generate filename
        filename = name.replace("-", "_").replace(" ", "_").lower() + ".png"
        public_url = f"{config.UPLOAD_API}/mock_images/{filename}"
        # print(public_url)
        # CHECK MEDIAURL EXISTS 
        cursor.execute("""
            SELECT MID FROM MediaURL WHERE CAST(MediaURL AS NVARCHAR(MAX)) = ?
        """, (public_url,))
        media_row = cursor.fetchone()

        if media_row:
            mid = media_row[0]
        else:
            # create Gallery
            cursor.execute("""
                INSERT INTO Gallery (MediaType)
                VALUES ('image');
                SELECT SCOPE_IDENTITY();
            """)
            cursor.nextset()
            mid = cursor.fetchone()[0]

            # insert MediaURL
            cursor.execute("""
                INSERT INTO MediaURL (MID, MediaURL)
                VALUES (?, ?)
            """, (mid, public_url))

        # check Has_Media กันซ้ำ
        cursor.execute("""
            SELECT 1 FROM Has_Media WHERE AID = ? AND MID = ?
        """, (animal_id, mid))

        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO Has_Media (AID, MID, UploadDate)
                VALUES (?, ?, GETDATE())
            """, (animal_id, mid))

        conn.commit()

    conn.close()
    