from flask import Flask, jsonify, request, abort, Blueprint
import pyodbc
import config
# app = Flask(__name__)

MEDIA_BASE_URL = "http://127.0.0.1:5500/frontend/images/"
animal_bp = Blueprint('animal', __name__)

def get_db_connection():
    try:
        server = 'localhost\SQLEXPRESS'
        database = 'ZoogleDB'
        conn_str = (
            f"DRIVER={{SQL Server}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
        )
        return pyodbc.connect(conn_str)
    except Exception as e:
        print("DB Connection Error:", e)
        raise


def _format_animal_row(row):
    return {
        "id": row.AID,
        "name": row.Name,
        "sciName": row.SciName,
        "category": row.Category,
        "zone": row.Zone,
        "image": config.BACKEND_URL + str(row.MainImage),
        # (MEDIA_BASE_URL + row.MainImage) if row.MainImage else None,
        "dangerLevel": row.DangerousLevel,
    }


@animal_bp.route('/animals', methods=['GET'])
def get_all_animals():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        category = request.args.get('category')

        query = """
            SELECT
                v.AID, v.Name, v.SciName, v.Category, v.Zone, v.DangerousLevel,
                (
                    SELECT TOP 1 m.MediaURL
                    FROM MediaURL m
                    JOIN Has_Media hm ON m.MID = hm.MID
                    WHERE hm.AID = v.AID
                ) AS MainImage
            FROM vw_animal_full_info v
        """

        if category:
            query += " WHERE v.Category = ?"
            cursor.execute(query, (category,))
        else:
            cursor.execute(query)


        animals = [_format_animal_row(row) for row in cursor.fetchall()]

        return jsonify(animals)

    except Exception as e:
        print("Error /animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@animal_bp.route('/animals/search', methods=['GET'])
def search_animals():
    """GET /animals/search?keyword=X — เรียกจาก user.js searchAnimals()"""
    keyword = request.args.get('keyword', '').strip()
    if not keyword:
        return jsonify([])

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("{CALL sp_search_animals(?)}", (keyword,))

        animals = []
        for row in cursor.fetchall():
            animals.append({
                "id": row.AID,
                "name": row.Name,
                "sciName": row.SciName,
                "category": row.CategoryName,
                "zone": row.ZoneName,
            })

        return jsonify(animals)

    except Exception as e:
        print("Error /animals/search:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@animal_bp.route('/events', methods=['GET'])
def get_events():
    """GET /events — เรียกจาก user.js getEvents()"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.EID, e.ShowName, e.ShowTime, e.ShowDate, z.ZName AS Zone
            FROM Event e
            LEFT JOIN Zone z ON e.ZID = z.ZID
            ORDER BY e.ShowDate, e.ShowTime
        """)

        events = []
        for row in cursor.fetchall():
            events.append({
                "id": row.EID,
                "showName": row.ShowName,
                "showTime": str(row.ShowTime),
                "showDate": str(row.ShowDate),
                "zone": row.Zone
            })

        return jsonify(events)

    except Exception as e:
        print("Error /events:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


@animal_bp.route('/animals/<int:id>', methods=['GET'])
def get_animal_detail(id):
    conn = None
    try:
        conn = get_db_connection()

        cursor1 = conn.cursor()
        cursor1.execute("{CALL sp_get_animal_detail(?)}", (id,))
        row = cursor1.fetchone()

        if not row:
            abort(404, description="Animal not found")

        cursor2 = conn.cursor()
        image_query = """
            SELECT m.MediaURL
            FROM MediaURL m
            JOIN Has_Media hm ON m.MID = hm.MID
            WHERE hm.AID = ?
        """
        cursor2.execute(image_query, (id,))
        # images = [(MEDIA_BASE_URL + r[0]) for r in cursor2.fetchall() if r[0]]
        # images = [r[0] for r in cursor2.fetchall() if r[0]]

        images = [
            config.BACKEND_URL + r[0]
            for r in cursor2.fetchall()
            if r[0]
        ]

        print(images)

        animal_detail = {
            "id": row.AID,
            "name": row.Name,
            "sciName": row.SciName,
            "description": row.Description,
            "longDescription": row.BioCharacter,
            "sex": row.Sex,
            "quantity": row.Quantity,
            "category": row.CategoryName,
            "zone": row.ZoneName,
            "dangerLevel": row.DangerousLevel,
            "image": images[0] if images else None,
            "images": images
        }

        return jsonify(animal_detail)

    except pyodbc.Error as e:
        print("SQL Error:", e)
        return jsonify({"error": "Database error"}), 500

    except Exception as e:
        print("Error /animals/<id>:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn:
            conn.close()


# if __name__ == '__main__':
#     app.run(debug=True)
