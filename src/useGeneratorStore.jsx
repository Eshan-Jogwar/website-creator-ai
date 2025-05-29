import { create } from "zustand";
import Generator from "./GeneratorElement";
import { v4 as uuidv4 } from "uuid";
const Generators = {};
const GeneratorProperties = {};
const useGeneratorStore = create((set) => ({
  GeneratorID: [],
  SelectedGeneratorId: null,
  addGenerators: () =>
    set((state) => {
      const Id = uuidv4();
      Generators[Id] = <Generator />;
      GeneratorProperties[Id] = {
        aiPrompt: "",
        code: "",
      };
      return { GeneratorID: [...state.GeneratorID, Id] };
    }),

  getGenerator: (Id) => {
    return Generators[Id];
  },
}));

export default useGeneratorStore;
