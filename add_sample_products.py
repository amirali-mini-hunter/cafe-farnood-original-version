from app import db, Product, app

# اجرای این اسکریپت برای اضافه کردن محصولات نمونه به دیتابیس
with app.app_context():
    # محصولات نمونه (همه محصولات از صفحه اصلی)
    sample_products = [
        Product(name="لاته آرت", price="۹۵,۰۰۰ تومان", description="ترکیب هنر و قهوه، اسپرسو خالص با شیر بخار دیده"),
        Product(name="کاپوچینو", price="۸۵,۰۰۰ تومان", description="ترکیب فوق‌العاده اسپرسو و شیر بخاردار شده"),
        Product(name="اسپرسو سینگل", price="۶۵,۰۰۰ تومان", description="طعم خالص و تند قهوه با کرمای طلایی"),
        Product(name="آمریکانو", price="۷۰,۰۰۰ تومان", description="قهوه‌ای ملایم برای لحظات آرام شما"),
        Product(name="قهوه ترک اصل", price="۹۰,۰۰۰ تومان", description="طعم اصیل و سنتی با عطر بی‌نظیر"),
        Product(name="موکا شکلاتی", price="۹۵,۰۰۰ تومان", description="ترکیب دلنشین قهوه و شکلات بلژیکی")
    ]

    # اضافه کردن به دیتابیس
    db.session.add_all(sample_products)
    db.session.commit()

    print("محصولات نمونه با موفقیت اضافه شدند!")
