import react from "react";
import React, { JSX } from "npm:@types/react";
import { useContext } from "react";

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import duration from "dayjs/plugin/duration";
import engb from 'dayjs/locale/en-gb'

import { useFetchDayScheduleQuery } from "../api/apiSlice.ts";
import { ConfigContext } from '../../contexts/ConfigContext.ts';
import { Station, Programme } from "../../../types/types.ts";
import ProgrammeDetails from "../programmes/ProgrammeDetails.tsx";
import { useMantineTheme } from "@mantine/core";


dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.locale(engb);

type DayScheduleColumnProps = {
    station: Station  ,
    date: Date,
    gridPeriod: number
    gridColumn: number
}

const DayScheduleColumn = ({station, date, gridPeriod, gridColumn }: DayScheduleColumnProps) => {
    const theme = useMantineTheme();
    const config = useContext(ConfigContext);
    const dayScheduleQueryResult = useFetchDayScheduleQuery({
        host: config.api.host,
        port: config.api.port,
        protocol: config.api.protocol,
        station: station,
        date: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth() + 1
    });
   
    const programmes:JSX.Element[] = [];
    if (dayScheduleQueryResult.isFetching) {
        programmes.push(<span key={`${gridColumn}-empty`} style={{
            gridRowStart: 1, 
            gridRowEnd: Math.round((24 * 60) / gridPeriod) + 2
        }}>Loading...</span>);
    } else if (dayScheduleQueryResult.isSuccess ) {
        const gridProgrammes: { [key: string]: [Programme] } = {};
        for (let i = 0; i < dayScheduleQueryResult.data.programmes.length; i++) {
            const programme = dayScheduleQueryResult.data.programmes[i];
            const gridStart = Math.round(dayjs(programme.time.start).hour() * (60 / gridPeriod) + dayjs(programme.time.start).minute() / gridPeriod);
            // const gridEnd = gridStart + Math.round(dayjs.duration(programme.time.duration).asMinutes() / 15);
            if (!gridProgrammes[gridStart.toString()]) {
                gridProgrammes[gridStart.toString()] = [programme];
            } else {
                gridProgrammes[gridStart.toString()].push(programme);
            }
        }
        for (const key of Object.keys(gridProgrammes)) {
            const progs = gridProgrammes[key];
            const gridStart = parseInt(key);
            const gridEnd = progs.reduce(
                (max, prog) => {
                    const end = gridStart + Math.round(dayjs.duration(prog.time.duration).asMinutes() / 15);
                    if (end > max) {
                        return end;
                    } else {
                        return max; 
                    }
                }, gridStart
            );
            
            const elements = progs.map((programme) => 
                   <ProgrammeDetails key={`${programme.time.start}`} programme={programme} scheduleMode={true} />
            );
            programmes.push(
                <div key={`${gridStart}-${gridEnd}`} style={{
                    gridRowStart: gridStart + 2, 
                    gridRowEnd: gridEnd + 2, 
                    gridColumnStart: gridColumn, 
                    gridColumnEnd: gridColumn, 
                }}>
                    {elements}
                </div>
            );
        }
    }
    
    return(
        <>
            <span key={date.getTime()} style={{
                    gridRowStart: 1, 
                    gridRowEnd: 1,
                    backgroundColor: theme.colors.blue[9],
                    color: theme.white,
                    marginTop: "0.5em",
                }}>{date.toDateString()}</span>
            {programmes}
        </>
        
    );
};

export default DayScheduleColumn;