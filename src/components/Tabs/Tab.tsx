import React from "react";
import { Link } from "react-router-dom";

interface TabProps {
  children: React.ReactNode;
  tabKey: number;
  selected: number;
  to: string;
  setSelectedTab: Function;
}

const Tab = ({ children, selected, tabKey, setSelectedTab, to }: TabProps) => {
  return (
    <Link to={to}>
      <div
        onClick={() => setSelectedTab(tabKey)}
        className={`text-md h-8 rounded-t-sm border py-1 px-2 font-semibold  ${
          selected === tabKey
            ? `border-neutral-800  border-b-neutral-200 text-sky-700`
            : "border-transparent"
        } w-max`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Tab;
