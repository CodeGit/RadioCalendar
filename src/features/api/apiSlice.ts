import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Station, DaySchedule, Programme } from '../../../types/types.ts'

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

export interface GetSelectedArguments extends ApiArguments {
  page?: number,
  size?: number,
  date?: number,
}

export interface SelectedArguments extends ApiArguments {
  programme: Programme
}

// Define a service using a base URL and expected endpoints
export const radioApi = createApi({
  baseQuery: fetchBaseQuery({ }),
  endpoints: (builder) => ({
    fetchStations: builder.query<Station[], ApiArguments>({
        query: ({host, port, protocol}) => `${protocol}://${host}:${port}/api/stations`,
        transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    fetchDaySchedule: builder.query<DaySchedule, ScheduleArguments>({
      query: ({host, port, protocol, station, year, month, date}) =>`${protocol}://${host}:${port}/api/station/${station.key}/year/${year}/month/${month.toString().padStart(2, '0')}/date/${date.toString().padStart(2, '0')}`,
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    fetchSelected: builder.query<Programme[], GetSelectedArguments>({
      query: ({host, port, protocol, page, size, date}) => {
        const url = `${protocol}://${host}:${port}/api/selected`;
        if (page || size || date) {
          url.concat('?');
        }
        if (page && size) {
          url.concat(`&page=${page}&size=${size}`);
        }
        if (date) {
          url.concat(`date=${date}`);
        }
        return url;
      },
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,

    }),
    isSelected: builder.query<boolean, SelectedArguments>({
      query: ({host, port, protocol, programme}) =>`${protocol}://${host}:${port}/api/selected/${programme.pid}`,
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    setSelected: builder.mutation<null, SelectedArguments> ({
      query: ({host, port, protocol, programme}) => ({
        url: `${protocol}://${host}:${port}/api/selected/${programme.pid}`,
        method: "PUT",
        body: { 
          programme: programme,
          selected: true
        }
      }),
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    setDeselected: builder.mutation<null, SelectedArguments> ({
      query: ({host, port, protocol, programme}) => ({
        url: `${protocol}://${host}:${port}/api/selected/${programme.pid}`,
        method: "PUT",
        body: { 
          programme: programme,
          selected: false
        }
      }),
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    fetchProgramme: builder.query<{programme: Programme}, SelectedArguments>({
      query: ({host, port, protocol, programme}) => `${protocol}://${host}:${port}/api/programme/${programme.pid}`,
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
    fetchProgrammeDetails: builder.query<{online: boolean, series: string, description: string}, SelectedArguments>({
      query: ({host, port, protocol, programme}) => `${protocol}://${host}:${port}/api/programme/details/${programme.pid}`,
      transformErrorResponse: (response: {status: string|number}, meta, arg) => response.status,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useFetchStationsQuery, 
  useFetchDayScheduleQuery, 
  useFetchSelectedQuery, 
  useSetSelectedMutation, 
  useSetDeselectedMutation,
  useIsSelectedQuery,
  useFetchProgrammeQuery,
  useFetchProgrammeDetailsQuery,
} = radioApi;
