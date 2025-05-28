import { useRef, useState, useEffect } from "react";
import generateText from "./CallingOllama";

const EDGE_THRESHOLD = 10; // pixels from edge to trigger resize

const Generator = () => {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [size, setSize] = useState({ width: 200, height: 200 });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    containerRef.current = boxRef.current?.parentNode;
  }, []);

  const getCursorStyle = (edge) => {
    switch (edge) {
      case "right":
        return "ew-resize";
      case "bottom":
        return "ns-resize";
      case "corner":
        return "nwse-resize";
      default:
        return isDragging ? "grabbing" : "grab";
    }
  };

  const detectEdge = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    const isNearRight = e.clientX >= rect.right - EDGE_THRESHOLD;
    const isNearBottom = e.clientY >= rect.bottom - EDGE_THRESHOLD;
    if (isNearRight && isNearBottom) return "corner";
    if (isNearRight) return "right";
    if (isNearBottom) return "bottom";
    return null;
  };

  const handleMouseDown = (e) => {
    const edge = detectEdge(e);
    const containerRect = containerRef.current.getBoundingClientRect();
    const boxRect = boxRef.current.getBoundingClientRect();

    offsetRef.current = {
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top,
      containerLeft: containerRect.left,
      containerTop: containerRect.top,
    };

    if (edge) {
      setIsResizing(true);
      setResizeEdge(edge);
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const x =
        e.clientX - offsetRef.current.containerLeft - offsetRef.current.x;
      const y =
        e.clientY - offsetRef.current.containerTop - offsetRef.current.y;
      setPosition({ left: x, top: y });
    } else if (isResizing) {
      const deltaX =
        e.clientX - offsetRef.current.containerLeft - position.left;
      const deltaY = e.clientY - offsetRef.current.containerTop - position.top;

      setSize((prev) => ({
        width:
          resizeEdge === "right" || resizeEdge === "corner"
            ? Math.max(50, deltaX)
            : prev.width,
        height:
          resizeEdge === "bottom" || resizeEdge === "corner"
            ? Math.max(50, deltaY)
            : prev.height,
      }));
    } else {
      const edge = detectEdge(e);
      boxRef.current.style.cursor = getCursorStyle(edge);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, resizeEdge]);

  useEffect(() => {
    console.log(
      generateText("who is goku", "llama3.1").then((responce) =>
        console.log(responce)
      )
    );
  }, []);

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        border: "2px solid black",
        backgroundColor: "white",
        userSelect: "none",
      }}
    ></div>
  );
};

export default Generator;
