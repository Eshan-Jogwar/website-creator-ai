import "./Layout.css";
import SideBar from "./SideBar";
import MainArea from "./MainArea";
import PropertiesPanel from "./PropertiesPanel";
export default function Layout() {
  return (
    <div className="layout">
      <SideBar />
      <MainArea />
      <PropertiesPanel />
    </div>
  );
}
