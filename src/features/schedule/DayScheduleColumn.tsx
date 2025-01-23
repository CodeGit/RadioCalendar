import react from "react";
import React from "npm:@types/react@^19.0.7";
import { useState, useEffect, Suspense, useContext } from "react";

import dayjs from "dayjs";


import { useFetchDayScheduleQuery } from "../api/apiSlice.ts";
import { ConfigContext } from '../../contexts/ConfigContext.ts';
import { Station, DaySchedule } from "../../../types/types.ts";

type DayScheduleColumnProps = {
    station: Station  ,
    date: Date,
}

const DayScheduleColumn = ({station, date }: DayScheduleColumnProps) => {
    
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
            gridRowStart: 2, 
            gridRowEnd: 96
        }}>Loading...</span>;
    } else if (dayScheduleQueryResult.isSuccess ) {
        console.log(dayScheduleQueryResult.data);
        for (let i = 0; i < dayScheduleQueryResult.data.programmes.length; i++) {
            const programme = dayScheduleQueryResult.data.programmes[i];
            programmes.push(
                <span key={programme.pid}>
                    {programme.title}
                </span>
            );
        }
    }
    
    return(
        <>
            <span key={date.getTime()} style={{border: "1px solid green"}}>{date.toDateString()}</span>
            {programmes}
        </>
        
    );
};

export default DayScheduleColumn;