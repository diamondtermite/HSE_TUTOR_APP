import sqlite3

connection = sqlite3.connect("requests.db")
cursor = connection.cursor()