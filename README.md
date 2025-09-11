
# کافه فرنود – فول‌استک (Flask + Vite/React)

پروژه شامل:
- بک‌اند Flask با SQLAlchemy و پایگاه‌داده SQLite (پیش‌فرض).
- فرانت‌اند React با Vite.
- پنل مدیریت (`admin.html`) برای افزودن/حذف محصول که با API در ارتباط است.

## پیش‌نیازها
- Python 3.10+ و pip
- Node.js 18+

## راه‌اندازی سریع (Development)
1) وابستگی‌های بک‌اند را نصب و اجرا کنید:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
- آدرس API: http://127.0.0.1:5000

2) وابستگی‌های فرانت‌اند را نصب و اجرا کنید:
```bash
npm install
npm run dev
```
- آدرس فرانت‌اند: http://localhost:5173

## پنل‌ها و API
- صفحه اصلی: http://localhost:5173
- پنل مدیریت: http://localhost:5173/admin.html
- APIها:
   - GET /api/products
   - POST /api/products  (body: { name, price, description })
   - DELETE /api/products/:id

نمونه تست سریع با curl:
```bash
# لیست محصولات
curl http://127.0.0.1:5000/api/products

# افزودن محصول
curl -X POST http://127.0.0.1:5000/api/products \
   -H 'Content-Type: application/json' \
   -d '{"name":"لاته آرت","price":"۹۵,۰۰۰ تومان","description":"ترکیب هنر و قهوه"}'

# حذف محصول (به‌جای 1، آی‌دی واقعی را قرار دهید)
curl -X DELETE http://127.0.0.1:5000/api/products/1
```

## تنظیم CORS
در بک‌اند، CORS برای Originهای Vite (`http://localhost:5173` و `http://127.0.0.1:5173`) فعال شده است.
اگر پورت یا دامنه را تغییر دادید، در `app.py` قسمت CORS را به‌روزرسانی کنید.

## پیکربندی پایگاه‌داده (اختیاری)
پیش‌فرض SQLite است: `sqlite:///cafe_farnood.db`
برای MySQL، نمونه DSN:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://USER:PASS@localhost/cafe_farnood'
```

## عیب‌یابی
- پورت‌ها مشغول‌اند؟
   ```bash
   fuser -k 5000/tcp 5173/tcp || true
   ```
- محصول حذف نمی‌شود؟ مطمئن شوید آی‌دی واقعی است و لاگ سرور خطا نمی‌دهد.
- اگر fetch از فرانت خطا می‌دهد، آدرس API را در `admin.html` و `App.tsx` بررسی کنید.

## ساختار مهم
- `app.py`: API Flask و مدل Product
- `admin.html`: پنل مدیریت (افزودن/حذف و لیست)
- `index.html`, `App.tsx`: فرانت React (نمایش محصولات)
- `requirements.txt`, `package.json`: وابستگی‌ها
