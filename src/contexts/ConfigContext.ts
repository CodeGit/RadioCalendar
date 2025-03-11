import { createContext } from "react";
import type { Station } from '../../types/types.ts';

export interface Config {
    'api': {
        'host': string,
        'port': string,
        'protocol': string,
    },
    'stations': Station[],
    'urls': {
      'programme': string,
      'play': string,
    }
}

export const ConfigContext = createContext<Config>({
  api: {
    host: "",
    port: "",
    protocol: "",
  },
  stations: [],
  'urls': {
      'programme': "",
      'play': "",
    }
});