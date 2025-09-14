import React, { useState } from 'react';
import { CoffeeCupIcon, XMarkIcon } from './Icons';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    
    if (Object.keys(newErrors).length === 0) {
      const BACKEND = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? 'http://127.0.0.1:5000'
        : '';

      // POST to backend register endpoint
      // clear previous form error
      setErrors({});

      fetch(`${BACKEND}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            // show server-side message
            setErrors({ form: data.message || 'خطا در ثبت نام' });
            console.error('register failed', res.status, data);
            return;
          }
          // success: store minimal session and redirect to dashboard
          try { localStorage.setItem('user', JSON.stringify(data.user || {})); } catch (e) {}
          window.location.href = '/dashboard.html';
        })
        .catch((err) => {
          setErrors({ form: 'خطا در اتصال به سرور' });
          console.error('register network error', err);
        });
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900/95 border border-amber-600/30 rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CoffeeCupIcon className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-bold text-amber-400">کافه فرنود</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-amber-400 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl text-stone-300 text-center mb-6">ثبت نام</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-amber-600/30 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-center"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-amber-600/30 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-center"
                placeholder="ایمیل خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                شماره تلفن
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-amber-600/30 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-center"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                نام کاربری
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-amber-600/30 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-center"
                placeholder="نام کاربری دلخواه خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 transition-all text-center ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                    : 'border-amber-600/30 focus:border-amber-400 focus:ring-amber-400/20'
                }`}
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 text-center">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-400 mb-2 text-center">
                تکرار رمز عبور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 transition-all text-center ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                    : 'border-amber-600/30 focus:border-amber-400 focus:ring-amber-400/20'
                }`}
                placeholder="رمز عبور خود را دوباره وارد کنید"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 text-center">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {errors.form && (
            <p className="text-red-400 text-sm text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ثبت نام
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-stone-400 text-sm">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              وارد شوید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal; 