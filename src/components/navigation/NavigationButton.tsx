import React from 'react';

interface Props {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const NavigationButton: React.FC<Props> = ({ title, isActive, onClick }) => {
  return (
    <div className="flex flex-col justify-center items-center cursor-pointer" onClick={onClick}>
      <div className={`text-nav mt-1 ${isActive ? 'text-[#606AB1]' : 'text-black'}`}>{title}</div>
    </div>
  );
};

export default NavigationButton;
