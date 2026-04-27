from flask import Flask, jsonify, request, abort
import pyodbc

app = Flask(__name__)

MEDIA_BASE_URL = "http://127.0.0.1:5500/frontend/images/" 

def get_db_connection():
    try:
        server = 'LOCALHOST'
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

@app.route('/api/animals', methods=['GET'])
def get_all_animals():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT AID, Name, SciName, Category, Zone, DangerousLevel 
            FROM vw_animal_full_info
        """
        cursor.execute(query)

        animals = []
        for row in cursor.fetchall():
            animals.append({
                "id": row.AID,
                "name": row.Name,
                "scientific_name": row.SciName,
                "category": row.Category,
                "location_zone": row.Zone,
                "danger_level": row.DangerousLevel
            })

        return jsonify(animals)

    except Exception as e:
        print("Error /api/animals:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        conn.close()

@app.route('/api/animals/<int:id>', methods=['GET'])
def get_animal_detail(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("{CALL sp_get_animal_detail(?)}", (id,))
        row = cursor.fetchone()

        if not row:
            abort(404, description="Animal not found")

        image_query = """
            SELECT m.MediaURL 
            FROM MediaURL m
            JOIN Has_Media hm ON m.MID = hm.MID
            WHERE hm.AID = ?
        """
        cursor.execute(image_query, (id,))
        images = [
            r[0] if r[0].startswith('http') else MEDIA_BASE_URL + r[0]
            for r in cursor.fetchall()
        ]

        animals_id = {
            "id": row.AID,
            "name": row.Name,
            "scientific_name": row.SciName,
            "bio": row.BioCharacter,
            "sex": row.Sex,
            "quantity": row.Quantity,
            "category": row.CategoryName,
            "zone": row.ZoneName,
            "danger_level": row.DangerousLevel,
            "images": images
        }

        return jsonify(animals_id)

    except pyodbc.Error as e:
        print("SQL Error:", e)
        return jsonify({"error": "Database error"}), 500

    except Exception as e:
        print("Error /api/animals/<id>:", e)
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)