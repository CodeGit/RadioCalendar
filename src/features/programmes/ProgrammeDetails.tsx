import react from 'react';
import React, { JSX } from "npm:@types/react";

import { useMantineTheme, Anchor  } from '@mantine/core';

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { Programme } from "../../../types/types.ts";

const ProgrammeDetails = ({programme, scheduleMode}: {programme: Programme, scheduleMode: boolean}) => {
    const theme = useMantineTheme();
    const start = dayjs(programme.time.start);
    const end = dayjs(programme.time.end);
    const parser = new DOMParser();
    return (
        <div style={{
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.5)", 
            backgroundColor: theme.colors.blue[1],
            borderRadius: "1em",
            margin: "0.3em",
            // border: "0.2em solid black",
        }}>
            <img style={{
                    borderTopRightRadius: "1em",
                    borderTopLeftRadius: "1em",
                    backgroundColor: theme.white,
                    color: theme.white,
                    objectFit: "contain",
                }} src={programme.image} alt={programme.title} />
            <div style={{
                    backgroundColor: theme.colors.blue[8],
                    color: theme.white,
                    paddingLeft: "0.5em",
                    paddingRight: "0.5em",
                    paddingBottom: "0.5em",
                }}>{parser.parseFromString(programme.title, "text/html").body.textContent}</div>
            <div style={{
                    backgroundColor: theme.colors.blue[4],
                    color: theme.white,
                    padding: "0.1em",
                }}>{parser.parseFromString(programme.subtitle ?? "", "text/html").body.textContent}</div>
            <div style={{
                    padding: "0.5em",
                    textAlign: "left",
                }}>{parser.parseFromString(programme.synopsis ?? "", "text/html").body.textContent}</div>
            { programme.episode ? <div>{programme.episode}</div> : "" }
            <div style={{
                padding: "0.1em",
                backgroundColor: theme.colors.blue[2],
                fontSize: "smaller",

            }}> { scheduleMode ? 
                `${start.hour().toString().padStart(2, "0")}:${start.minute().toString().padStart(2, "0")} 
                    - ${end.hour().toString().padStart(2, "0")}:${end.minute().toString().padStart(2, "0")}`
                : `${programme.station?.name}`
                }
            </div>
            <Anchor style={{
                padding: "0.1em",
            }} href={programme.url}>BBC Sounds</Anchor>
        </div>
    );

}

export default ProgrammeDetails;