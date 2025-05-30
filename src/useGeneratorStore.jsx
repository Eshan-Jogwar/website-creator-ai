import { create } from "zustand";
import Generator from "./GeneratorElement";
import { v4 as uuidv4 } from "uuid";
const Generators = {};
const GeneratorProperties = {};
const GeneratorMetaData = {};
const useGeneratorStore = create((set) => ({
  GeneratorID: [],
  SelectedGeneratorId: null,
  addGenerators: () =>
    set((state) => {
      const Id = uuidv4();
      Generators[Id] = <Generator _generatorId={Id} />;
      GeneratorProperties[Id] = {
        description: "",
        name: `Generator`,
      };
      GeneratorMetaData[Id] = {
        position: { left: 100, top: 100 },
        size: { width: 200, height: 200 },
      };
      return { GeneratorID: [...state.GeneratorID, Id] };
    }),

  getGenerator: (Id) => {
    return Generators[Id];
  },
  getGeneratorProperties: (Id) => {
    return GeneratorProperties[Id];
  },
  getGeneratorName: (Id) => {
    return GeneratorProperties[Id].name;
  },
  setGeneratorProperties: (Id, property, value) => {
    GeneratorProperties[Id][property.toString()] = value;
  },
  setGeneratorMetaData: (Id, property, value) => {
    GeneratorMetaData[Id][property.toString()] = value;
  },
  setGeneratorSelected: (Id) =>
    set((state) => {
      return { SelectedGeneratorId: Id };
    }),

  getPromptData: () => {
    return { GeneratorProperties, GeneratorMetaData };
  },
}));

export default useGeneratorStore;
