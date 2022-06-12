import { Outlet, useLocation } from "react-router-dom";
import { useTransition, animated } from "@react-spring/web";

const AnimationLayout = () => {
  const { pathname } = useLocation();
  const transition = useTransition(pathname, {
    from: { opacity: 0 },
    to: { opacity: 1 },
    enter: { opacity: 1 },
    delay: 50,
  });
  return transition(
    ({ opacity }, item) =>
      item && (
        <animated.div style={{ opacity }}>
          <Outlet />
        </animated.div>
      )
  );
};

export default AnimationLayout;
