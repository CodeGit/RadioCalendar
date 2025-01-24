import react from "react";
import React from "npm:@types/react@^19.0.7";
import { useState, useEffect, Suspense, useContext } from "react";

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import duration from "dayjs/plugin/duration";
import engb from 'dayjs/locale/en-gb'

import { useFetchDayScheduleQuery } from "../api/apiSlice.ts";
import { ConfigContext } from '../../contexts/ConfigContext.ts';
import { Station, DaySchedule } from "../../../types/types.ts";

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
    const domParser = new DOMParser();
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
    const programmes = [];
    if (dayScheduleQueryResult.isFetching) {
        return <span style={{
            gridRowStart: 1, 
            gridRowEnd: Math.round((24 * 60) / gridPeriod) + 2
        }}>Loading...</span>;
    } else if (dayScheduleQueryResult.isSuccess ) {
        console.log(dayScheduleQueryResult.data);
        for (let i = 0; i < dayScheduleQueryResult.data.programmes.length; i++) {
            const programme = dayScheduleQueryResult.data.programmes[i];
            const gridStart = Math.round(dayjs(programme.time.start).hour() * (60 / gridPeriod) + dayjs(programme.time.start).minute() / gridPeriod);
            const gridEnd = gridStart + Math.round(dayjs.duration(programme.time.duration).asMinutes() / 15);
            programmes.push(
                <span key={`${programme.time.start}`} style={{
                            gridRowStart: gridStart + 2, 
                            gridRowEnd: gridEnd + 2, 
                            gridColumnStart: gridColumn, 
                            gridColumnEnd: gridColumn, 
                            border: "1px solid green"
                        }}>
                    <p />{domParser.parseFromString(programme.title, "text/html").body.textContent}
                    <p />{domParser.parseFromString(programme.subtitle ?? "", "text/html").body.textContent}
                    <p />{dayjs(programme.time.start).hour().toString().padStart(2, "02")}:{dayjs(programme.time.start).minute().toString().padStart(2, "02")} - {dayjs(programme.time.end).hour().toString().padStart(2, "02")}:{dayjs(programme.time.end).minute().toString().padStart(2, "02")}
                    <p />{dayjs.duration(programme.time.duration).asMinutes().toString().padStart(2, "02")} minutes
                    <p />{gridStart+2} - {gridEnd+2}
                </span>
            );
        }
    }
    
    return(
        <>
            <span key={date.getTime()} style={{gridRowStart: 1, gridRowEnd: 1}}>{date.toDateString()}</span>
            {programmes}
        </>
        
    );
};

export default DayScheduleColumn;