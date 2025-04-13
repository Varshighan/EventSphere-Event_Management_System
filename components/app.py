import bisect
from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": ""}})

# 🔥 Initialize Firebase
cred = credentials.Certificate("event-management-b5f16-firebase-adminsdk-fbsvc-1cbb6fc775.json")  # Replace with your actual path
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ B+ Tree for efficient search
class BPlusTree:
    def __init__(self):
        self.data = {}

    def insert(self, key, value):
        if key in self.data:
            self.data[key].append(value)
        else:
            self.data[key] = [value]

    def search(self, key):
        return self.data.get(key, [])

event_tree = BPlusTree()

@app.route('/events', methods=['GET'])
def get_events():
    try:
        events_ref = db.collection("events")
        docs = events_ref.stream()

        events_list = []
        for doc in docs:
            event_data = doc.to_dict()
            event_data["id"] = doc.id  # Store document ID
            events_list.append(event_data)

            
            event_tree.insert(event_data.get("eventDate", "Unknown"), event_data)
            event_tree.insert(event_data.get("category", "Unknown").upper(), event_data)

        return jsonify({"events": events_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search/date/<date>', methods=['GET'])
def search_by_date(date):
    results = event_tree.search(date)
    return jsonify(results if results else {"message": "No events found."})

@app.route('/search/category/<category>', methods=['GET'])
def search_by_category(category):
    results = event_tree.search(category.upper())
    return jsonify(results if results else {"message": "No events found."})

if __name__ == '__main__':
    app.run(debug=True)
