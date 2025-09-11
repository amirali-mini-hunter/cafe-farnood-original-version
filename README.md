
# کافه فرنود - پروژه فول استک

این پروژه شامل پنل مدیریت کافه با استفاده از Flask (بک‌اند) و React (فرانت‌اند) است. محصولات به صورت واقعی از دیتابیس MySQL نمایش داده می‌شوند.

## آموزش اجرای پروژه

### پیش‌نیازها:
- Node.js (برای فرانت‌اند)
- Python 3 (برای بک‌اند)
- pip (برای نصب وابستگی‌های Python)
- MySQL Server (برای ذخیره‌سازی داده‌های واقعی)

### مراحل اجرا:

1. **کلون کردن ریپوزیتوری:**
   ```bash
   git clone https://github.com/amirali-mini-hunter/cafe-farnood.git
   cd cafe-farnood
   ```

2. **نصب وابستگی‌های فرانت‌اند:**
   ```bash
   npm install
   ```

3. **نصب وابستگی‌های بک‌اند:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # در ویندوز: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **تنظیم دیتابیس MySQL:**
   - MySQL Server را نصب و اجرا کنید.
   - یک دیتابیس جدید ایجاد کنید:
     ```sql
     CREATE DATABASE cafe_farnood;
     ```
   - اطلاعات اتصال را در فایل `app.py` به‌روزرسانی کنید:
     ```python
     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://your_username:your_password@localhost/cafe_farnood'
     ```

5. **اجرای سرور بک‌اند (Flask API):**
   ```bash
   source venv/bin/activate
   python3 app.py
   ```
   - سرور روی `http://127.0.0.1:5000` اجرا می‌شود.
   - جداول به صورت خودکار ایجاد می‌شوند.

6. **اضافه کردن محصولات واقعی به دیتابیس:**
   - از ابزار مانند phpMyAdmin یا MySQL Workbench استفاده کنید.
   - یا از فایل `add_sample_products.py` برای اضافه کردن محصولات نمونه (همه محصولات صفحه اصلی):
     ```bash
     source venv/bin/activate
     python3 add_sample_products.py
     ```
   - یا از اسکریپت Python مستقیم:
     ```python
     from app import db, Product, app
     with app.app_context():
         # محصولات نمونه
         products = [
             Product(name="لاته آرت", price="۹۵,۰۰۰ تومان", description="ترکیب هنر و قهوه"),
             Product(name="کاپوچینو", price="۸۵,۰۰۰ تومان", description="قهوه ایتالیایی کلاسیک"),
             # ... سایر محصولات
         ]
         db.session.add_all(products)
         db.session.commit()
     ```

7. **اجرای سرور فرانت‌اند (React):**
   ```bash
   npm run dev
   ```
   - سرور روی `http://localhost:5173` اجرا می‌شود.

8. **اجرای سرور برای فایل‌های HTML (پنل ادمین):**
   ```bash
   python3 -m http.server 8080
   ```
   - سرور روی `http://localhost:8080` اجرا می‌شود.

### دسترسی به پنل‌ها:
- **پنل اصلی (منوی کافه):** `http://localhost:5173`
- **پنل مدیریت:** `http://localhost:8080/admin.html`
- **API محصولات:** `http://127.0.0.1:5000/api/products`

### ویژگی‌ها:
- نمایش داینامیک محصولات واقعی از دیتابیس MySQL
- پنل مدیریت برای مشاهده لیست محصولات
- استفاده از CORS برای ارتباط امن بین فرانت‌اند و بک‌اند

### نکات مهم:
- برای محیط production، از متغیرهای محیطی برای اطلاعات حساس استفاده کنید.
- مطمئن شوید همه سرورها همزمان اجرا شوند.
- محصولات باید به صورت دستی به دیتابیس اضافه شوند تا واقعی باشند.
- اگر دیتابیس خالی باشد، API لیست خالی برمی‌گرداند.

### ساختار پروژه:
- `app.py`: کد اصلی Flask API
- `admin.html`: پنل مدیریت با جاوا اسکریپت داینامیک
- `index.html` و `App.tsx`: فرانت‌اند React
- `requirements.txt`: وابستگی‌های Python
- `package.json`: وابستگی‌های Node.js
