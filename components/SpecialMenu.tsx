import React from 'react';
import { StarIcon, ClockIcon, BuildingIcon } from './Icons';

const InfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
      {icon}
    </div>
    <span className="text-stone-300">{text}</span>
  </div>
);

const SpecialMenu: React.FC = () => {
  return (
    <section 
      className="bg-[#2a1a0e] rounded-2xl p-8 border border-amber-700/40 shadow-lg"
      aria-labelledby="special-menu-title"
    >
      <h2 id="special-menu-title" className="text-3xl font-bold text-center mb-4 text-amber-400">منوی ویژه ما</h2>
      <p className="max-w-3xl mx-auto text-center text-stone-300 mb-6">
        از بهترین دانه‌های قهوه جهان تا نوشیدنی‌های خاص و دست‌ساز، هر جرعه، داستانی از کیفیت و عشق به قهوه.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        <InfoItem icon={<StarIcon className="w-6 h-6 text-amber-400" />} text="۴.۷ امتیاز" />
        <InfoItem icon={<ClockIcon className="w-6 h-6 text-amber-400" />} text="شروع فعالیت از ۱۳۹۸" />
        <InfoItem icon={<BuildingIcon className="w-6 h-6 text-amber-400" />} text="تنها شعبه فعال" />
      </div>
    </section>
  );
};

export default SpecialMenu;