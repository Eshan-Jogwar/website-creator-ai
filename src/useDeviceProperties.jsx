import { create } from "zustand";

const useDeviceProperties = create((set) => ({
  zoom: 1,
  width: 800,
  height: 600,
  setZoom: (newZoom) => set(() => ({ zoom: newZoom })),
  setWidth: (newWidth) => set(() => ({ width: newWidth })),
  setHeight: (newHeight) => set(() => ({ height: newHeight })),
}));

export default useDeviceProperties;
