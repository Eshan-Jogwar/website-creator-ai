import "./Layout.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1>⚡ DevPanel</h1>
      <nav style={{ display: "flex", flexDirection: "column" }}>
        <button>Dashboard</button>
        <button>Projects</button>
        <button>Settings</button>
      </nav>
      <div className="logout">
        <button>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
