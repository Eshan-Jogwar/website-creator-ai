import { create } from "zustand";
import Generator from "./GeneratorElement";
import { v4 as uuidv4 } from "uuid";
const Generators = {};

const useGeneratorStore = create((set) => ({
  GeneratorID: [],
  addGenerators: () =>
    set((state) => {
      const Id = uuidv4();
      Generators[Id] = <Generator />;
      return { GeneratorID: [...state.GeneratorID, Id] };
    }),

  getGenerator: (Id) => {
    return Generators[Id];
  },
}));

export default useGeneratorStore;
