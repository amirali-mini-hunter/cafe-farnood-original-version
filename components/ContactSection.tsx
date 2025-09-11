import React from 'react';
import { InstagramIcon, PhoneIcon, LocationIcon } from './Icons';

const ContactInfo: React.FC<{ icon: React.ReactNode; text: string; href: string }> = ({ icon, text, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
  >
    {icon}
    <span className="text-stone-300 font-medium">{text}</span>
  </a>
);


const ContactSection: React.FC = () => {
  return (
    <section 
      className="bg-[#2a1a0e] rounded-2xl p-8 border border-amber-700/40 shadow-lg mt-16"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="text-3xl font-bold text-center mb-6 text-amber-400">تماس با ما</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <ContactInfo 
          icon={<InstagramIcon className="w-8 h-8 text-amber-400" />} 
          text="cafe_farnood"
          href="https://instagram.com/cafe_farnood"
        />
        <ContactInfo 
          icon={<PhoneIcon className="w-8 h-8 text-amber-400" />} 
          text="۰۲۱-۱۲۳۴۵۶۷۸"
          href="tel:+982112345678"
        />
        <ContactInfo 
          icon={<LocationIcon className="w-8 h-8 text-amber-400" />} 
          text="تهران، میدان ولیعصر"
          href="#"
        />
      </div>
    </section>
  );
};

export default ContactSection;