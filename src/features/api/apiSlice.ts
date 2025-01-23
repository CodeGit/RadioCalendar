import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Station, DaySchedule } from '../../../types/types.ts'

export interface ApiArguments {
  host: string,
  port: string,
  protocol: string,
}

export interface ScheduleArguments extends ApiArguments {
  station: Station,
  year: number,
  month: number,
  date: number,
}

// Define a service using a base URL and expected endpoints
export const radioApi = createApi({
  baseQuery: fetchBaseQuery({ }),
  endpoints: (builder) => ({
    fetchStations: builder.query<Station[], ApiArguments>({
        query: ({host, port, protocol}) => `${protocol}://${host}:${port}/api/stations`
    }),
    fetchDaySchedule: builder.query<DaySchedule, ScheduleArguments>({
      query: ({host, port, protocol, station, year, month, date}) =>`${protocol}://${host}:${port}/api/station/${station.key}/year/${year}/month/${month.toString().padStart(2, '0')}/date/${date.toString().padStart(2, '0')}`
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFetchStationsQuery, useFetchDayScheduleQuery } = radioApi;
