import React from "react";

type LogoProps = {
  className?: string;
  size?: number;
};

const Logo: React.FC<LogoProps> = ({ className, size = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo.svg" alt="2Hacker Logo" width={size} height={size} className="mr-2" />
      <span className="font-mono font-bold text-primary">2HACKER</span>
    </div>
  );
};

export default Logo;
