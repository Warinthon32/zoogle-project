import pyodbc
import config

def get_db_connection():
    try:
        server = config.DATABASE_SERVER
        database = config.DATABASE_NAME
        driver = config.DATABASE_DRIVER

        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
        )
        return pyodbc.connect(conn_str)
    except Exception as e:
        print("DB Connection Error:", e)
        raise


    
# def get_db_connection():
#     try:
#         server = 'localhost\SQLEXPRESS'
#         # server = 'LAPTOP-TAELV2HA\\armer'
#         database = 'ZoogleDB'
#         conn_str = (
#             "DRIVER={ODBC Driver 17 for SQL Server};"
#             "SERVER=localhost;"
#             "DATABASE=ZoogleDB;"
#             "Trusted_Connection=yes;"
#             "TrustServerCertificate=yes;"
# )
#         return pyodbc.connect(conn_str)
#         print("✅ DB Connected successfully!")
#     except Exception as e:
#         print("DB Connection Error:", e)
#         raise
