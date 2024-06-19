from flask import Flask, request, jsonify, render_template, redirect, url_for, session, g
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import random
from apscheduler.schedulers.background import BackgroundScheduler # Remember to Configure Python Interpreter
from datetime import datetime
import atexit

# Create Flask application instance
app = Flask(__name__, template_folder='../Frontend/templates', static_folder='../Frontend/static')
app.secret_key = 'mojodojocasahouse'

# Configure Flask-mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587 
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'workingday007@gmail.com'
app.config['MAIL_PASSWORD'] = 'tdfn jsds fhrs ocng'
app.config['MAIL_DEFAULT_SENDER'] = 'workingday007@gmail.com'
mail = Mail(app)

DATABASE = 'monojar.db'

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
                password TEXT NOT NULL,
                verified INTEGER DEFAULT 0
            )
        ''')

        # Add the verified column if it doesn't exist
        cursor.execute('PRAGMA table_info(users)')
        columns = [column[1] for column in cursor.fetchall()]
        if 'verified' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0')

        # Create the temporary users table for verification
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS temp_users (
                username TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')        

        # Create the jars table with auto-incremented ID as the primary key if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jars (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
            )
        ''')

        # Create the capsules table with auto-incremented ID as the primary key if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS capsules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
                scheduled_datetime TEXT NOT NULL,
                FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
            )
        ''')

        # Add the scheduled_datetime column if it doesn't exist
        cursor.execute('PRAGMA table_info(capsules)')
        columns = [column[1] for column in cursor.fetchall()]
        if 'scheduled_datetime' not in columns:
            cursor.execute('ALTER TABLE capsules ADD COLUMN scheduled_datetime DATETIME')
        if 'scheduled_date' in columns:
            cursor.execute('ALTER TABLE capsules DROP COLUMN scheduled_date')

        # Commit the changes to ensure the table is created
        g.db.commit()
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Send OTP email for verification
def send_otp_email(email):
    otp = random.randint(100000, 999999)  # Generate a random 6-digit OTP
    msg = Message('MonoJar Email Verification OTP', sender='workingday007@gmail.com', recipients=[email])
    msg.body = f'Your OTP for email verification is: {otp}'

    try:
        mail.send(msg)
        return otp
    except Exception as e:
        print(f"Failed to send email: {e}")
        return None

# APScheduler
scheduler = BackgroundScheduler()
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

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

# Verification page route
@app.route('/verification')
def verification_page():
    return render_template('verification.html')

# Create Jar route
@app.route('/createJar/<username>')
def create_jar(username):
    if 'username' not in session or session['username'] != username:
        return redirect(url_for('login_page'))
    return render_template('createJar.html', username=username)

# Sadness Jar route
@app.route('/sadnessJar/<username>')
def sadness_jar(username):
    return render_template('sadnessJar.html', username=username)

# Happiness Jar route
@app.route('/happinessJar/<username>')
def happiness_jar(username):
    return render_template('happinessJar.html', username=username)

# Convert list of tuples into list of dictionaries
def query_jars(username, jar_type):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, type, content FROM jars WHERE username = ? AND type = ?',
                   (username, jar_type))
    rows = cursor.fetchall()
    conn.close()

    jars = [{'id': row[0], 'type': row[1], 'content': row[2]} for row in rows]
    return jars

# Sadness Library route
@app.route('/sadnessLibrary/<username>')
def sadness_library(username):
    jars = query_jars(username, 'sadness')
    return render_template('sadnessLibrary.html', jars=jars, username=username)

# Happiness Library route
@app.route('/happinessLibrary/<username>')
def happiness_library(username):
    jars = query_jars(username, 'happiness')
    return render_template('happinessLibrary.html', jars=jars, username=username)

# Delete Jar route
@app.route('/deleteJar/<int:jar_id>', methods=['DELETE'])
def delete_jar(jar_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM jars WHERE id = ?', (jar_id,))
    jar_to_delete = cursor.fetchone()

    if jar_to_delete:
        cursor.execute('DELETE FROM jars WHERE id = ? AND username = ?', (jar_id, session['username']))
        conn.commit()
        conn.close()
        return jsonify({"success": True, 'message': 'Jar deleted successfully!'}), 200
    else:
        conn.close()
        return jsonify({"success": False, "error": "Jar not found"}), 404


# Time Capsule route
@app.route('/timeCapsule/<username>')
def time_capsule(username):
    return render_template('timeCapsule.html', username=username)

# Edit Nickname route
@app.route('/editNickname/<username>')
def edit_nickname(username):
    return render_template('editNickname.html', username=username)

# Notification route
@app.route('/notification/<username>')
def notification(username):
    return render_template('notification.html', username=username)

# About route
@app.route('/about/<username>')
def about(username):
    return render_template('about.html', username=username)

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
        cursor.execute('INSERT INTO temp_users (username, email, password) VALUES (?, ?, ?)', 
                       (username, email, hashed_password))
        conn.commit()

        otp = send_otp_email(email)
        session['otp'] = otp
        session['email'] = email

        return jsonify({'message': 'Registered successfully! Please verify your email.'})
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already registered!'}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        conn.close()


# Verification route Endpoint
@app.route('/verification', methods=['POST'])
def verification():
    data = request.json
    entered_otp = data['otp']
    expected_otp = session.get('otp')
    email = session.get('email')

    if not expected_otp or not email:
        return jsonify({'message': 'Session expired! Please register again.'}), 400

    if str(entered_otp) == str(expected_otp):
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM temp_users WHERE email = ?', (email,))
            user = cursor.fetchone()

            if user:
                username, email, password = user[2]
                cursor.execute('INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, 1)', 
                               (username, email, password))
                cursor.execute('DELETE FROM temp_users WHERE email = ?', (email,))
                conn.commit()
                session.pop('otp', None)
                session.pop('email', None)
                session.pop('username', None)
                return jsonify({'message': 'Email verified successfully!'})
            else:
                return jsonify({'message': 'User not found in temporary table!'}), 400
        except sqlite3.IntegrityError:
            return jsonify({'message': 'Username or email already registered!'}), 400
        except Exception as e:
            return jsonify({'message': 'An unexpected error occurred. Please try again later.'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Invalid OTP! Please try again.'}), 400

# Login route Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT username, email, password, verified FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[2], password):
        if user[3] == 1:
            session['username'] = user[0]
            return jsonify({'message': 'Login successfully!', 'redirect': url_for('create_jar', username=user[0])})
        else:
            return jsonify({'message': 'User not verified!'}), 403
    else:
        return jsonify({'message': 'Invalid credentials!'}), 400


# Logout route git
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

# Happiness Jar route Endpoint
@app.route('/happinessJar/<username>', methods=['POST'])
def create_happiness_jar(username):
    if 'username' not in session or session['username'] != username:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.json
    content = data.get('happiness_input')

    if not content:
        return jsonify({'message': 'Content is required'}), 400

    jar_type = 'happiness'
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO jars (username, type, content) VALUES (?, ?, ?)', 
                   (username, jar_type, content))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Create successfully! You can check your jar in Jar Library!'})

# Saddness Jar route Endpoint
@app.route('/sadnessJar/<username>', methods=['POST'])
def create_sadness_jar(username):
    if 'username' not in session or session['username'] != username:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.json
    content = data.get('sadness_input')

    if not content:
        return jsonify({'message': 'Content is required'}), 400

    jar_type = 'sadness'
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO jars (username, type, content) VALUES (?, ?, ?)', 
                   (username, jar_type, content))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Create successfully! You can check your jar in Jar Library!'})

# Time Capsule route Endpoint
@app.route('/timeCapsule/<username>', methods=['POST'])
def create_time_capsule(username):
    data = request.json
    capsule_content = data.get('capsule_input')
    scheduled_date = data.get('scheduled_date')
    scheduled_time = data.get('scheduled_time')

    """
    <Varied capsule type>
    capsule_type = data.get('type')
    Also need to modify the frontend accordingly
    """

    if not capsule_content or not scheduled_date or not scheduled_time:
        return jsonify({'success': False, 'message': 'All fields are required!'}), 400


    scheduled_datetime_str = f"{scheduled_date} {scheduled_time}"
    try:
        scheduled_datetime = datetime.strptime(scheduled_datetime_str, '%Y-%m-%d %H:%M')
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid date or time format!'}), 400

    """
    <Varied capsule type>
    if capsule_type in ['image', 'video'] and 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        capsule_content = filename
    """
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
            INSERT INTO capsules (username, type, content, scheduled_datetime) VALUES (?, ?, ?, ?)
        ''', (username, 'time_capsule', capsule_content, scheduled_datetime))
    conn.commit()
    conn.close()

    """
    <Varied capsule type>
    cursor.execute('''
        INSERT INTO capsules (username, type, content, scheduled_date) VALUES (?, ?, ?, ?)
    ''', (username, capsule_type, capsule_content, scheduled_date))
    """

    scheduler.add_job(
        send_capsule,
        'date',
        run_date=scheduled_datetime,
        args=[username, capsule_content]
    )

    """
    <Varied capsule type>
    args=[username, capsule_content, capsule_type]
    """

    return jsonify({'success': True, 'message': 'Time capsule created successfully!'})

# Send time capsule email
def send_capsule(username, capsule_content):
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user:
            user_email = user[0]
            msg = Message(
                'A message from your past self', 
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=[user_email]
            )
            msg.body = capsule_content

            try:
                mail.send(msg)
                return f"Email sent successfully to {user_email}"
            except Exception as e:
                print(f"Failed to send email: {e}")
                return None


# Running the APP
if __name__ == '__main__':
    app.run(debug=True)