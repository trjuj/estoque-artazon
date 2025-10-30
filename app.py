import os
import psycopg2
import sql_queries
import pyrebase
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)
url = os.getenv('DATABASE_URL')
connection = psycopg2.connect(url)

# ---------------------- SETUP DA AUTENTICAÇÃO ----------------------

config = { "apiKey": os.getenv('API_KEY'),
        "authDomain": os.getenv('AUTH_DOMAIN'),
        "projectId": os.getenv('PROJECT_ID'),
        "databaseURL": "https://" + os.getenv('PROJECT_ID') + ".firebaseio.com",
        "storageBucket": os.getenv('STORAGE_BUCKET'),
        "messagingSenderId": os.getenv('MESSAGING_SENDER_ID'),
        "appId": os.getenv('APP_ID'),
        "measurementId": os.getenv('MEASUREMENT_ID')}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

# ---------------------- ENDPOINTS REFERENTES A AUTENTICAÇÃO ----------------------

@app.post("/api/auth/signup")
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        user = auth.create_user_with_email_and_password(email, password)
    except Exception as e:
        return {"error": str(e)}, 400

    return {"message": "User created successfully"}, 201

@app.post("/api/auth/login")
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    try:
        user = auth.sign_in_with_email_and_password(email, password)
    except Exception as e:
        return {"error": str(e)}, 400

    return {"message": f"User logged in successfully"}, 200 # CHECAR SE E NECESSARIO ENVIAR SOMENTE O TOKEN

# ---------------------- ENDPOINTS ----------------------

@app.get("/api/product/<int:product_id>")
def get_product(product_id):
    with connection:
        with connection.cursor() as cursor:

            cursor.execute(sql_queries.GET_PRODUCT, (product_id,))
            product = cursor.fetchone()
            cursor.close()

    if product:
        product_data = {
            "name": product[0],
            "set_name": product[1],
            "product_type": product[2],
            "price": product[3],
            "quantity": product[4],
            "description": product[5],
            "image_url": product[6]
        }
        return {"product": product_data}, 200
    else:
        return {"error": "Product not found"}, 404

@app.get("/api/products")
def get_products():
    with connection:
        with connection.cursor() as cursor:
            
            cursor.execute(sql_queries.GET_ALL_PRODUCTS)
            products = cursor.fetchall()
            cursor.close()

    products_list = []
    for product in products:
        products_list.append({
            "id": product[0],
            "name": product[1],
            "set_name": product[2],
            "product_type": product[3],
            "price": product[4],
            "quantity": product[5],
            "description": product[6],
            "image_url": product[7]
        })

    return {"products": products_list}, 200

@app.post("/api/product")
def add_product():
    
    try:

        if not request.is_json:
            return jsonify({"error": "O corpo da requisição deve estar em formato JSON"}), 400

        data = request.get_json()
        print("JSON recebido:", data)
        name = str(data['name'])
        set_name = str(data['set_name'])
        product_type = str(data['product_type'])
        price = str(data['price'])
        quantity = str(data['quantity'])
        description = str(data['description'])
        image_url = str(data['image_url'])

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(sql_queries.CREATE_TABLE_PRODUCTS)
                cursor.execute(sql_queries.ADD_PRODUCT, (name, set_name, product_type, price, quantity, description, image_url))
                connection.commit()
                cursor.close()

        return {"message": "Product added successfully"}, 201
    
    except Exception as e:
        print("Erro ao adicionar produto:", str(e))
        return {"error": "Failed to add product"}, 500

@app.put("/api/product/<int:product_id>")
def update_product(product_id):
    data = request.get_json()
    name = str(data['name']) if data['name'] else None
    price = str(data['price']) if data['price'] else None
    set_name = str(data['set_name']) if data['set_name'] else None
    product_type = str(data['product_type']) if data['product_type'] else None
    quantity = str(data['quantity']) if data['quantity'] else None
    description = str(data['description']) if data['description'] else None
    image_url = str(data['image_url']) if data['image_url'] else None

    with connection:
        with connection.cursor() as cursor:

            cursor.execute(sql_queries.UPDATE_PRODUCT, (name, set_name, product_type, price, quantity, description, image_url, product_id))
            connection.commit()
            cursor.close()

    return {"message": "Product updated successfully"}, 200

@app.delete("/api/product/<int:product_id>")
def delete_product(product_id):
    with connection:
        with connection.cursor() as cursor:

            cursor.execute(sql_queries.DELETE_PRODUCT, (product_id,))
            connection.commit()
            cursor.close()

    return {"message": "Product deleted successfully"}, 200

if __name__ == '__main__':
    app.run()