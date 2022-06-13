import { useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import AnimationLayout from "./components/AnimationLayout";
import Dashboard from "./components/pages/Dashboard";
import Expenses from "./components/pages/Expenses";
import Income from "./components/pages/Income";
import Tools from "./components/pages/Tools";
import { animated, config, useTransition } from "@react-spring/web";

function App() {
  const location = useLocation();
  const transition = useTransition(location, {
    from: { opacity: 0, translateX: -15 },
    enter: { opacity: 1, translateX: 0 },
    leave: { opacity: 0, translateX: -15 },
    exitBeforeEnter: true,
    config: { mass: 1, tension: 275, friction: 30 },

    delay: 0,
  });
  return (
    <div className="container mx-auto">
      <header className=" w-full bg-sky-600">
        <div className="flex h-12 w-full items-center justify-center text-neutral-50">
          <h1 className="text-2xl font-bold">💵 React Money</h1>
        </div>
        <div className="flex border-collapse justify-center gap-[0.05rem]">
          <NavLink className="navlink" to="/">
            Dashboard
          </NavLink>
          <NavLink className="navlink" to="/expenses">
            Expenses
          </NavLink>
          <NavLink className="navlink" to="/income">
            Income
          </NavLink>
          <NavLink className="navlink" to="/tools">
            Tools
          </NavLink>
        </div>
      </header>
      {transition((props, item) => (
        <animated.main className="p-1" style={props}>
          <Routes location={item}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </animated.main>
      ))}
    </div>
  );
}

export default App;
