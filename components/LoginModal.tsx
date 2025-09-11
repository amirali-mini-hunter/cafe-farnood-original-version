import React, { useState } from 'react';
import { CoffeeCupIcon, XMarkIcon } from './Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900/95 border border-amber-600/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
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
          <h3 className="text-xl text-stone-300 text-center mb-6">ورود به حساب کاربری</h3>
          
          <div className="space-y-4">
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
                placeholder="نام کاربری خود را وارد کنید"
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
                className="w-full px-4 py-3 bg-black/30 border border-amber-600/30 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-center"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ورود
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <p className="text-stone-400 text-sm">
            حساب کاربری ندارید؟{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              ثبت نام کنید
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 