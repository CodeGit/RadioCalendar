import react from "react";
import { useState, useEffect, Suspense, useContext } from "react";

import { DatePicker, DateValue, Day } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Chip, Skeleton, Combobox, useCombobox } from '@mantine/core';
import '@mantine/dates/styles.css';

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import engb from 'dayjs/locale/en-gb'

import { ConfigContext } from '../contexts/ConfigContext.ts';
import { useFetchStationsQuery } from "../features/api/apiSlice.ts";
import { useAppDispatch, useAppSelector } from '../hooks.tsx';
import { changeDate, selectDate, changeStation, selectStation, toggleScheduleMode, fetchByWeek, selectSchedule, changeSchedule } from "../features/schedule/scheduleSlice.ts";
import { DaySchedule } from "../../types/types.ts";
import DayScheduleColumn from "../features/schedule/DayScheduleColumn.tsx";
import React from "npm:@types/react@^19.0.7";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.locale(engb);

export function Schedule() {
    const gridPeriod = 10;
    // redux stuff
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);
    const station = useAppSelector(selectStation);
    const isFetchByWeek = useAppSelector(fetchByWeek);
    const schedule = useAppSelector(selectSchedule);

    const [startDay, setStartDay] = useState(dayjs(date));
    const [lastDay, setLastDay] = useState(dayjs(date));

    const combobox = useCombobox({ 
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    
    const [opened, {open, close}] = useDisclosure(false);
    
    const config = useContext(ConfigContext);
    const stationQueryResult = useFetchStationsQuery({host: config.api.host, port: config.api.port, protocol: config.api.protocol});
    
    const options = stationQueryResult.data?.map((s) => {
        return (
            <Combobox.Option value={s.key} key={s.key} active={s.key === station?.key}>
                {s.name}
            </Combobox.Option>
        );
    });    

    const timeColumn = [<span key="time">Time</span>];
    for(let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += gridPeriod) {
            timeColumn.push(
                <span key={`${hours}-${minutes}`} style={{border: "1px solid red"}}>
                    {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
                </span>
            );
        }
    }
    console.log(`Column 1 ${timeColumn.length}`);
    const columns = [];
    if (station) {
        for(let i = startDay; i <= lastDay; i = i.add(1, "day")) {
            console.log(`Adding ${i.toDate().toDateString()} to columns ${columns.length}`);
            const weekDay = dayjs(i).weekday();    
            columns.push(
                <Suspense key={i.toString()} fallback={<Skeleton height={"50vh"} width={"12vw"}/>}>
                    <DayScheduleColumn gridColumn={weekDay + 2} gridPeriod={gridPeriod} date={i.toDate()} station={station} />
                </Suspense>
            );
        }
    }

    useEffect(() => {
        if (!station && stationQueryResult.data) {
            dispatch(changeStation(stationQueryResult.data[0]));
        }
    }, [stationQueryResult]);

    useEffect(() => {
        if (station && date) {
            const day = dayjs(date);
            let start = day;
            let last = day;
            if (isFetchByWeek) {
                const year = dayjs(date).year();
                const week = dayjs(date).week();    
                start = dayjs().year(year).week(week).weekday(0);
                last = dayjs().year(year).week(week).weekday(6);
            }
            setStartDay(start);
            setLastDay(last);
        }
    }, [station, date, isFetchByWeek]);
    
    return (
        <>
            <Modal opened={opened} onClose={close} title="Select Date" >
                {
                    <>
                        <DatePicker value={new Date(date)} onChange={(selectedDate: DateValue) => {
                            if (selectedDate) {
                                dispatch(changeDate(new Date(selectedDate).getTime()));
                                close();
                            }
                        }} withWeekNumbers />
                        <Chip checked={isFetchByWeek} onChange={() => dispatch(toggleScheduleMode())}>
                            { isFetchByWeek ? "Weekly schedule" : "Daily schedule" }
                        </Chip>                    
                    </>
                }
            </Modal>
            <Combobox 
                store={combobox}
                onOptionSubmit={(x) => {
                    const selected = stationQueryResult.data?.filter((s) => s.key === x).pop();
                    if (selected) {
                        dispatch(changeStation(selected));
                    }
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <Button
                        disabled={stationQueryResult.data === undefined}
                        variant="gradient"
                        rightSection={<Combobox.Chevron color="mantine-white"/>}
                        onClick={() => combobox.toggleDropdown()}
                    >
                        {station ? station.name : stationQueryResult?.data ? stationQueryResult?.data[0].name: "Loading"}
                    </Button>
                </Combobox.Target>
                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <Button variant="gradient" onClick={open}>
                {new Date(date).toDateString()}
            </Button>
            <div style={{
                    display: "grid", 
                    gridTemplateColumns: `0.5fr repeat(${columns.length}, 1fr)`,
                    gridTemplateRows:"max-content",
                    columnGap: "0.1rem",
                    gridAutoFlow: "column",
                    border: "1px red solid"
                    
                }}>
                {timeColumn}
                {columns}
            </div>
        </>
        
    );     
}