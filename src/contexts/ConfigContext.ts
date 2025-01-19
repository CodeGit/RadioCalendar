import { createContext } from "react";
import type { Station } from '../../types/types.ts';

export interface Config {
    configs: {
        'api': {
            'host': string,
            'port': string,
        },
        'stations': Station[]
    }
}

export const ConfigContext = createContext<Config>({});