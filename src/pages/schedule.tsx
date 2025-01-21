import React from "react";
import { useEffect, Suspense, useContext } from "react";

import { DatePicker, DateValue } from '@mantine/dates';
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
import { changeDate, selectDate, changeStation, selectStation, toggleScheduleMode, fetchByWeek } from "../features/schedule/scheduleSlice.ts";

export function Schedule() {
    dayjs.extend(weekOfYear);
    dayjs.extend(weekday);
    dayjs.locale(engb);

    // redux stuff
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);
    const station = useAppSelector(selectStation);
    const isFetchByWeek = useAppSelector(fetchByWeek);

    const combobox = useCombobox({ 
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    
    const [opened, {open, close}] = useDisclosure(false);
    const firstDayOfWeek = dayjs(date).weekday(0);
    
    const config = useContext(ConfigContext);
    const stationQueryResult = useFetchStationsQuery({host: config.api.host, port: config.api.port, protocol: config.api.protocol});
    
    const options = stationQueryResult.data?.map((s) => {
        return (
            <Combobox.Option value={s.key} key={s.key} active={s.key === station?.key}>
                {s.name}
            </Combobox.Option>
        );
    });    

    useEffect(() => {
        if (!station && stationQueryResult.data) {
            dispatch(changeStation(stationQueryResult.data[0]));
        }
    }, [stationQueryResult]);
    
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
            <Suspense fallback={
                <>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                    <Skeleton height={"50vh"} width={"12vw"}/>
                </>
            }>
            
            </Suspense>
        </>
        
    );     
}