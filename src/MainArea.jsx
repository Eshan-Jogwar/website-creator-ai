import { useEffect, useRef } from "react";
import "./Layout.css";
import useDeviceProperties from "./useDeviceProperties";
import useGeneratorStore from "./useGeneratorStore";
const MainArea = () => {
  const { zoom, setZoom, width, setWidth, height, setHeight } =
    useDeviceProperties();
  const { GeneratorID, addGenerators, getGenerator } = useGeneratorStore();
  const canvasWrapperRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrapper = canvasWrapperRef.current;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom((prev) => Math.max(0.3, Math.min(prev - e.deltaY * 0.0015, 3)));
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "KeyG") {
        isPanning.current = true;
        wrapper.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "KeyG") {
        isPanning.current = false;
        wrapper.style.cursor = "default";
      }
    };

    const handleMouseMove = (e) => {
      if (isPanning.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        wrapper.scrollLeft -= dx;
        wrapper.scrollTop -= dy;
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="mainArea">
      <div className="toolbar">
        <div className="zoomControls">
          <label>
            Zoom:
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <span>{Math.round(zoom * 100)}%</span>
          </label>
          <button onClick={() => setZoom(1)}>🔁 Reset</button>
        </div>

        <div className="dimensionControls">
          <label>
            Width:
            <input
              type="number"
              min="100"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              min="100"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
          <button onClick={() => addGenerators()}>Add Generator</button>
        </div>
      </div>

      <div className="canvasWrapper" ref={canvasWrapperRef}>
        <div
          className="canvas"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${zoom})`,
          }}
        >
          <div
            style={{ position: "relative", height: "100vh", width: "100vw" }}
          >
            {GeneratorID.map((id) => {
              return getGenerator(id);
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainArea;
