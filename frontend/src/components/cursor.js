// src/components/Cursor.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const follow = () => {
      setRingPosition((prev) => {
        return {
          x: prev.x + (mousePosition.x - prev.x) * 0.2,
          y: prev.y + (mousePosition.y - prev.y) * 0.2,
        };
      });
      requestAnimationFrame(follow);
    };
    follow();
  }, [mousePosition]);

  return (
    <>
      <Dot style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />
      <Ring style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }} />
    </>
  );
};

export default Cursor;

// Styled components
const Dot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: black;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
`;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: border 0.2s ease-out;
`;
