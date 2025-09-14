from flask import Flask, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# تنظیمات اتصال به پایگاه داده (برای تست از SQLite استفاده می‌کنیم)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafe_farnood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# تنظیم CORS برای دسترسی از Vite (5173)
# برای سهولت توسعه: اجازه CORS عمومی برای مسیرهای /api/*
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.after_request
def add_cors_headers(response):
    # افزودن هدرهای لازم برای پاسخ استاندارد CORS
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Vary'] = 'Origin'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


# پاسخ‌دهی کلی به درخواست‌های preflight (OPTIONS) برای مسیرهای API
@app.route('/api/<path:any>', methods=['OPTIONS'])
def handle_options(any):
    resp = app.make_response(('', 204))
    origin = request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Origin'] = origin
    resp.headers['Vary'] = 'Origin'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

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


# تعریف مدل User برای مدیریت کاربران در پنل ادمین
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }


# API endpoint برای دریافت لیست محصولات
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])


# API endpoint برای دریافت لیست کاربران
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@app.route('/api/users/<int:user_id>/reset', methods=['POST', 'OPTIONS'])
def reset_user_password(user_id):
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin', '*')
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json() or {}
    new_password = data.get('password')
    if not new_password:
        return jsonify({'message': 'رمز جدید ارسال نشده است.'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'کاربر پیدا نشد.'}), 404

    try:
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        resp = jsonify({'message': 'رمز با موفقیت بروزرسانی شد.'})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 200
    except Exception as e:
        return jsonify({'message': 'خطا در بروزرسانی رمز', 'error': str(e)}), 500


# API endpoint برای حذف کاربر
@app.route('/api/users/<int:user_id>', methods=['DELETE', 'OPTIONS'])
def delete_user(user_id):
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin', '*')
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'کاربر پیدا نشد.'}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        resp = jsonify({'message': 'کاربر با موفقیت حذف شد.'})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 200
    except Exception as e:
        resp = jsonify({'message': 'خطا در حذف کاربر', 'error': str(e)})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 500


@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'message': 'تمام فیلدها الزامی است.'}), 400
    # uniqueness checks
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'نام کاربری یا ایمیل تکراری است.'}), 400
    try:
        hashed = generate_password_hash(password)
        u = User(username=username, email=email, password_hash=hashed)
        db.session.add(u)
        db.session.commit()
        return jsonify({'message': 'ثبت نام با موفقیت انجام شد.', 'user': u.to_dict()}), 201
    except Exception as e:
        return jsonify({'message': 'خطا در ثبت نام', 'error': str(e)}), 500


@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login_user():
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin', '*')
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'نام کاربری و رمز عبور الزامی است.'}), 400

    # allow login by username or email
    user = User.query.filter((User.username == username) | (User.email == username)).first()
    if not user:
        return jsonify({'message': 'نام کاربری یا ایمیل یافت نشد.'}), 401

    if not user.password_hash or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'نام کاربری یا رمز عبور اشتباه است.'}), 401

    # success
    resp = jsonify({'message': 'ورود موفق', 'user': user.to_dict()})
    origin = request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Origin'] = origin
    resp.headers['Vary'] = 'Origin'
    return resp, 200

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


@app.route('/api/products/<int:product_id>', methods=['PUT', 'OPTIONS'])
def update_product(product_id):
    # پاسخ preflight برای مرورگر
    if request.method == 'OPTIONS':
        origin = request.headers.get('Origin', '*')
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json() or {}
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'محصول پیدا نشد.'}), 404

    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    if not name or not price or not description:
        return jsonify({'message': 'تمام فیلدها الزامی است.'}), 400

    try:
        product.name = name
        product.price = price
        product.description = description
        db.session.commit()
        resp = jsonify({'message': 'محصول با موفقیت به‌روز شد.'})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 200
    except Exception as e:
        resp = jsonify({'message': 'خطا در به‌روزرسانی محصول', 'error': str(e)})
        origin = request.headers.get('Origin', '*')
        resp.headers['Access-Control-Allow-Origin'] = origin
        resp.headers['Vary'] = 'Origin'
        return resp, 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # ایجاد جداول اگر وجود ندارند
    app.run(debug=True)
