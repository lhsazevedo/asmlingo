import React from "react";

type CardProps = {
  children: React.ReactNode;
};

export const Card = ({ children }: CardProps) => {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl p-8 mt-10">
      {children}
    </div>
  );
};
