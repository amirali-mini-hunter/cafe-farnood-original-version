from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# تنظیمات اتصال به پایگاه داده (برای تست از SQLite استفاده می‌کنیم)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafe_farnood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# تنظیم CORS برای دسترسی از Vite (5173)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ],
            "methods": ["GET", "POST", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    },
)

# تعریف مدل Product
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description
        }


# API endpoint برای دریافت لیست محصولات
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

# API endpoint برای افزودن محصول جدید
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    if not name or not price or not description:
        return jsonify({'message': 'تمام فیلدها الزامی است.'}), 400
    new_product = Product(name=name, price=price, description=description)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'محصول با موفقیت افزوده شد.'}), 201

# API endpoint برای حذف محصول (با CORS صریح برای Vite)
@app.route('/api/products/<int:product_id>', methods=['DELETE', 'OPTIONS'])
def delete_product(product_id):
    # پاسخ preflight برای مرورگر
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin', '*')
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'محصول پیدا نشد.'}), 404
    try:
        db.session.delete(product)
        db.session.commit()
        resp = jsonify({'message': 'محصول با موفقیت حذف شد.'})
        # افزودن هدر CORS برای پاسخ اصلی
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 200
    except Exception as e:
        resp = jsonify({'message': 'خطا در حذف محصول', 'error': str(e)})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # ایجاد جداول اگر وجود ندارند
    app.run(debug=True)
