from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# Create Flask application instance

app = Flask(__name__)
app.secret_key = 'mojodojocasahouse'

# Initialise database

def init_db():
    conn = sqlite3.connect('monojar.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

with app.app_context():
    init_db()

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
    data = request.form
    username = data['username']
    email = data['email']
    password = data['password']
    hashed_password = generate_password_hash(password, method='sha256')

    try:
        conn = sqlite3.connect('monojar.db')
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
    data = request.form
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('monojar.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        session['user_id'] = user[0]
        return jsonify({'message': 'Login successful!'})
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


