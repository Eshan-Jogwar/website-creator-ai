import { useState, useEffect } from "react";
import "./Layout.css";
import useGeneratorStore from "./useGeneratorStore";
import axios from "axios";

const PropertyElement = ({ label, value, onChange }) => {
  return (
    <div className="formGroup">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(label, e.target.value)}
      />
    </div>
  );
};

const PropertiesPanel = () => {
  const {
    getGeneratorProperties,
    setGeneratorProperties,
    SelectedGeneratorId,
  } = useGeneratorStore();

  const [generatorProperties, setGeneratorPropsLocal, getPromptData] = useState(
    {}
  );

  const HandleGenerate = async () => {
    const responce = await axios.post(
      "http://localhost:5000/api/GenerateWebsite",
      {
        promptData: getPromptData(SelectedGeneratorId),
      }
    );
    console.log(responce);
  };

  useEffect(() => {
    if (SelectedGeneratorId) {
      const props = getGeneratorProperties(SelectedGeneratorId);
      setGeneratorPropsLocal({ ...props }); // create a copy for local editing
    }
  }, [SelectedGeneratorId, getGeneratorProperties]);

  const handleChange = (key, newValue) => {
    setGeneratorPropsLocal((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    setGeneratorProperties(SelectedGeneratorId, key, newValue);
  };

  return (
    <aside className="propertiesPanel">
      <h3>Properties</h3>
      {Object.entries(generatorProperties).map(([key, value]) => (
        <PropertyElement
          key={key}
          label={key}
          value={value}
          onChange={handleChange}
        />
      ))}
      <button
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => HandleGenerate()}
      >
        Generate Element
      </button>
    </aside>
  );
};

export default PropertiesPanel;
