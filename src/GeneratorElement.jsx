import { useRef, useState, useEffect } from "react";
import useGeneratorStore from "./useGeneratorStore"; // import the store

const EDGE_THRESHOLD = 10;

const ParsingHtmlFunction = ({ innerHtmlInput }) => {
  const [innerHtml, setInnerHtml] = useState("hello world");
  const holderRef = useRef();

  useEffect(() => {
    setInnerHtml(innerHtmlInput);
  }, []);

  useEffect(() => {
    if (holderRef.current) {
      holderRef.current.innerHTML = innerHtml;
    }
  }, [innerHtml]);

  return <div ref={holderRef}>{innerHtml}</div>;
};

const Generator = ({ _generatorId }) => {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [generating, setGenerating] = useState(false);

  const {
    setGeneratorSelected,
    setGeneratorMetaData,
    getPromptData,
    SelectedGeneratorId,
  } = useGeneratorStore(); // ✅ Get the setter from store

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

  const handleClick = () => {
    setGeneratorSelected(_generatorId); // ✅ Set selected generator on click
  };

  useEffect(() => {
    setGeneratorMetaData(_generatorId, "position", position);
  }, [position]);

  useEffect(() => {
    setGeneratorMetaData(_generatorId, "size", size);
    console.log(getPromptData());
  }, [size]);

  return (
    <div
      ref={boxRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        border:
          _generatorId == SelectedGeneratorId
            ? "solid 2px blue"
            : "solid 2px black",
        backgroundColor: "white",
        userSelect: "none",
      }}
    >
      {generating ? "Generating...." : ""}
    </div>
  );
};

export default Generator;
