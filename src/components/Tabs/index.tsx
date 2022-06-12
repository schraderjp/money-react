import React from "react";

interface TabProps {
  children: React.ReactNode;
}

const Tabs = ({ children }: TabProps) => {
  return (
    <div className="flex h-8 w-full justify-center border-b border-neutral-800">
      {children}
    </div>
  );
};

export default Tabs;
