import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
    )
    cursor = conn.cursor()
    with open("schema.sql", encoding="utf-8") as f:
        comandos = [c.strip() for c in f.read().split(";") if c.strip()]
    for comando in comandos:
        cursor.execute(comando)
    conn.commit()
    cursor.close()
    conn.close()
    print("Banco 'termometro' pronto.")
except mysql.connector.Error as erro:
    print("Não foi possível criar o banco:", erro)
    print("Confira se o MySQL está ligado e se a senha no arquivo .env está certa.")
