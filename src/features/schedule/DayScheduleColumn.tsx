import react from "react";
import React from "npm:@types/react@^19.0.7";
import { Station } from "../../../types/types.ts";

type DayScheduleColumnProps = {
    station: Station | undefined  ,
    date: Date,
}

const DayScheduleColumn = ({station, date }: DayScheduleColumnProps) => {
    return(
        <>
            <span key={date.getTime()} style={{border: "1px solid green"}}>{date.toDateString()}</span>
            <span key={date.getTime()+1} style={{border: "1px solid green"}}>{"Contents"}</span>
        </>
        
    );
};

export default DayScheduleColumn;