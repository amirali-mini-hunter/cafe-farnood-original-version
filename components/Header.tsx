import React, { useState } from 'react';
import { CoffeeCupIcon } from './Icons';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface HeaderProps {
  cafeName: string;
}

const Header: React.FC<HeaderProps> = ({ cafeName }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <header className="py-6 bg-black/20 backdrop-blur-md border-b border-amber-600/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          {/* Title and Subtitle container */}
          <div className="text-center md:text-right mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start gap-4">
                  <h1 className="text-5xl font-bold tracking-wider text-amber-400">{cafeName}</h1>
                  <CoffeeCupIcon className="w-12 h-12 text-amber-400" />
              </div>
              <p className="mt-2 text-lg text-stone-400">تجربه ای فراتر از قهوه</p>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLoginClick}
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ورود / ثبت نام
          </button>
        </div>
      </header>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeModals} 
        onSwitchToRegister={switchToRegister} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeModals} 
        onSwitchToLogin={switchToLogin} 
      />
    </>
  );
};

export default Header;