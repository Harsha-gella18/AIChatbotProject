from flask import Flask, render_template, jsonify
import os
from dotenv import load_dotenv
from config import API_KEY

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-api-key')
def get_api_key():
    return jsonify({"api_key": API_KEY})

if __name__ == '__main__':
    app.run(debug=True)
