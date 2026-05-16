import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ClickBurstContext = createContext();

const ClickBurst = ({ x, y, onDone }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="fixed pointer-events-none z-[9999]" style={{ left: x, top: y }}>
      {particles.map((_, i) => {
        const angle = (360 / 12) * i;
        const rad = (angle * Math.PI) / 180;
        const dist = 30 + Math.random() * 25;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              scale: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={i === 0 ? onDone : undefined}
            className="absolute w-2 h-2 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            style={{
              background: `hsl(${42 + Math.random() * 10}, 100%, ${55 + Math.random() * 15}%)`,
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        );
      })}
    </div>
  );
};

export const ClickBurstProvider = ({ children }) => {
  const [bursts, setBursts] = useState([]);

  const addBurst = useCallback((x, y) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x, y }]);
  }, []);

  const removeBurst = useCallback((id) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Check if it's a button or something interactive
      const target = e.target.closest("button, a, select, input[type='submit'], input[type='button'], [role='button']");
      if (target) {
        addBurst(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [addBurst]);

  return (
    <ClickBurstContext.Provider value={{ addBurst }}>
      {children}
      <AnimatePresence>
        {bursts.map((b) => (
          <ClickBurst key={b.id} x={b.x} y={b.y} onDone={() => removeBurst(b.id)} />
        ))}
      </AnimatePresence>
    </ClickBurstContext.Provider>
  );
};

export const useClickBurst = () => useContext(ClickBurstContext);
