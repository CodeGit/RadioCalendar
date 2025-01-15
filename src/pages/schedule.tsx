import React from "react";
import { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";

import { DatePicker, DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import '@mantine/dates/styles.css';

import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from '../hooks.tsx';
import { changeDate, selectDate } from "../features/schedule/scheduleSlice.ts";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import engb from 'dayjs/locale/en-gb'


export function Schedule() {
    dayjs.extend(weekOfYear);
    dayjs.extend(weekday);
    dayjs.locale(engb);
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);

    const [opened, {open, close}] = useDisclosure(false);
    const firstDayOfWeek = dayjs(date).weekday(0);
    console.log(dayjs.locale());
    console.log(firstDayOfWeek);
    return (
        <div>
            <Modal opened={opened} onClose={close} title="Select Date" >
                {<DatePicker value={date} onChange={(selectedDate: DateValue) => {
                    if (selectedDate) {
                        dispatch(changeDate(new Date(selectedDate).getTime()));
                    }
                }} withWeekNumbers />}
            </Modal>
            <Button variant="gradient" onClick={open}>
                {new Date(date).toDateString()}
            </Button>
            <Suspense fallback={<div>Loading...</div>}>
            
            </Suspense>
        </div>
        
    );     
}