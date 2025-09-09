from flask import Flask, request, render_template, jsonify
import mysql.connector
import os  

app = Flask(__name__)

# Simple function to get a new DB connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "sql12.freesqldatabase.com"),
        user=os.getenv("DB_USER", "sql12797791"),
        password=os.getenv("DB_PASSWORD", "1pV1aaWJDi"),
        database=os.getenv("DB_NAME", "sql12797791")
    )

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/templates/daily.html')
def daily():
    return render_template("daily.html")

@app.route('/add_expense', methods=['POST'])
def add_expense():  
    data = request.json
    date = data.get('date')
    category = data.get('category')
    amount = data.get('amount')
    description = data.get('description', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO expenses (date, category, amount, description) VALUES (%s, %s, %s, %s)",
        (date, category, amount, description)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"}), 201


if __name__ == "__main__":
    app.run(debug=True)