from flask import Flask, request, jsonify, render_template, redirect, url_for, session, g
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Create Flask application instance

app = Flask(__name__, template_folder='../Frontend/templates', static_folder='../Frontend/static')
app.secret_key = 'mojodojocasahouse'

DATABASE = 'monojar.db'

# Determine base URL based on environment
IS_DEPLOY = os.getenv('IS_DEPLOY') == 'False'
if IS_DEPLOY:
    BASE_URL = "https://monojar-test.onrender.com"
else:
    BASE_URL = "http://127.0.0.1:5000"


# Initialise database connection (Singleton pattern)
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        cursor = g.db.cursor()

        # Create the users table with username as the primary key if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        # Commit the changes to ensure the table is created
        g.db.commit()
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Routes and logic
# Home route
@app.route('/')
def home():
    return render_template('landing.html')

# Login page route
@app.route('/login')
def login_page():
    return render_template('login.html')

# Register page route
@app.route('/register')
def register_page():
    return render_template('register.html')

# Registration route Endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                       (username, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Registered successfully!'})
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already registered!'}), 400

# Login route Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        session['user_id'] = user[0]
        return jsonify({'message': 'Login successfully!'})
    else:
        return jsonify({'message': 'Invalid credentials!'}), 400

# Logout route git

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))

# Running the APP

if __name__ == '__main__':
    app.run(debug=True)