import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Station } from '../../../types/types.ts'

export interface ApiArguments {
  host: string,
  port: string,
}

// Define a service using a base URL and expected endpoints
export const stationApi = createApi({
  baseQuery: fetchBaseQuery({ }),
  endpoints: (builder) => ({
    fetchStations: builder.query<Station[], ApiArguments>({
        query: ({host, port}) => { 
          console.log("MAQ context " + `host=${host} port=${port}`);
          return `http://${host}:${port}/api/stations`;
        }
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFetchStationsQuery   } = stationApi;