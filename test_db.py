import sqlite3

conn = sqlite3.connect('jobs.db')
cursor = conn.cursor()
cursor.execute('SELECT name FROM sqlite_master WHERE type="table"')
tables = cursor.fetchall()
print("Tables:", tables)

# Check users table
cursor.execute('SELECT * FROM users')
users = cursor.fetchall()
print("Users:", users)

conn.close()