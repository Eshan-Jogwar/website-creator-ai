import "./Layout.css";
const PropertiesPanel = () => {
  return (
    <aside className="propertiesPanel">
      <h3>Properties</h3>
      <div className="formGroup">
        <label>Property Name</label>
        <input type="text" placeholder="Enter value" />
      </div>
      <div className="formGroup">
        <label>Another Property</label>
        <select>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
