import { createContext } from "react";
import type { Station } from '../../types/types.ts';

export interface Config {
    'api': {
        'host': string,
        'port': string,
        'protocol': string,
    },
    'stations': Station[]
}

export const ConfigContext = createContext<Config>({
  api: {
    host: "",
    port: "",
    protocol: "",
    "programme": ""
  },
  stations: []
});