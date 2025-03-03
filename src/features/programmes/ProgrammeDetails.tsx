import react, {useContext, useEffect, useState} from 'react';
import React, { JSX } from "npm:@types/react";

import { useMantineTheme, Anchor, Box, Loader, LoadingOverlay  } from '@mantine/core';

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ConfigContext } from "../../contexts/ConfigContext.ts";
import { Programme } from "../../../types/types.ts";
import { useSetSelectedMutation, useSetDeselectedMutation, useIsSelectedQuery } from "../api/apiSlice.ts";

const ProgrammeDetails = ({programme, scheduleMode}: {programme: Programme, scheduleMode: boolean}) => {
    const config = useContext(ConfigContext);
    const [updateSelection, setUpdateSelection] = useState(false);

    const { 
        currentData: isSelected, 
        isFetching: isSelectedFetching, 
        isError: isSelectedError,
        refetch: refetchIsSelected ,
    } = useIsSelectedQuery({   
            host: config.api.host, 
            port: config.api.port, 
            protocol: config.api.protocol,
            programme,
    });
    const [setSelected, setSelectedResult] = useSetSelectedMutation();
    const [setDeselected, setDeselectedResult] = useSetDeselectedMutation();
    const theme = useMantineTheme();
    const start = dayjs(programme.time.start);
    const end = dayjs(programme.time.end);
    const parser = new DOMParser();
    const boxStyle: any = {
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.5)", 
        backgroundColor: theme.colors.blue[1],
        borderRadius: "1em",
        margin: "0.3em",
    };
    
    if (isSelected) {
        boxStyle['border'] = "0.2em solid black";
    }

    const onSelect = async () => {
        if (isSelected) {
            await setDeselected({
                host: config.api.host, 
                port: config.api.port, 
                protocol: config.api.protocol,
                programme,
            });
        } else {
            await setSelected({
                host: config.api.host, 
                port: config.api.port, 
                protocol: config.api.protocol,
                programme,
            });
        }
        refetchIsSelected(); 
    };

    
    return (
        <>
            { isSelectedFetching && 
                <div style={{
                    zIndex: 1,
                    opacity: 0.5,
                    position: "absolute",
                }}>
                    <Loader color="red" size="lg" type="dots" />
                </div>
            //     <LoadingOverlay 
            //     visible={true} 
            //     zIndex={10} 
            //     overlayProps={{radius: "lg", blur: 2}}
            //     loaderProps={{ color: 'pink', type: 'bars' }} 
            // />
            }    
            <div style={boxStyle} onClick={onSelect}>
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
                { programme.episode !== 0 ? <div>{programme.episode} / {programme.episode_total} </div> : null}
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
        </>
    );

}

export default ProgrammeDetails;