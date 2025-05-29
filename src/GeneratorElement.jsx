import { useRef, useState, useEffect } from "react";
import generateText from "./CallingOllama";

const EDGE_THRESHOLD = 10; // pixels from edge to trigger resize

const ParsingHtmlFunction = ({ innerHtmlInput }) => {
  const [innerHtml, setInnerHtml] = useState("hello world");
  const holderRef = useRef();
  useEffect(() => {
    setInnerHtml(innerHtmlInput);
  }, []);

  useEffect(() => {
    console.log();
    holderRef.current.innerHTML = innerHtml;
  }, [innerHtml]);

  return <div ref={holderRef}>{innerHtml}</div>;
};

const Generator = () => {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [size, setSize] = useState({ width: 200, height: 200 });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [code, setCode] = useState("");
  const [generating, setGenerating] = useState(false);
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
    >
      <button
        onClick={() => {
          console.log("generating please wait");
          setGenerating(true);
          generateText(
            "generate code for a minimilistic button the colors to use are purple and blue and give it a great font" +
              "only give the html of what would go inside the return statement nothing else. no other words or explaination just code. use only inline plain css though the style attribute. do not use tailwind and do not use bootstrap",
            "llama3.1"
          ).then((elem) => {
            setCode(elem);
            console.log("hello world");
            console.log(elem);
            setGenerating(false);
          });
        }}
      >
        click to generateText
      </button>
      {generating ? (
        "Generating..."
      ) : (
        <ParsingHtmlFunction
          innerHtmlInput={code.replace("html", "").split("```")[1]}
        />
      )}
    </div>
  );
};

export default Generator;
