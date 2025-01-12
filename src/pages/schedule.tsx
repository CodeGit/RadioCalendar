import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import '@mantine/dates/styles.css';
import { useAppDispatch, useAppSelector } from '../hooks.tsx';
import { changeDate, selectDate } from "../features/schedule/scheduleSlice.ts";

export function Schedule() {
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);

    const [opened, {open, close}] = useDisclosure(false);

    return (
        <div style={{alignContent: 'left'}}>
            <Modal opened={opened} onClose={close} title="Select Date" >
                {<DatePicker value={date} onChange={(e) => {
                    
                    if (e) {
                        console.log(e.toDateString());
                        dispatch(changeDate(e));
                    }
                }} withWeekNumbers />}
            </Modal>
            <Button variant="gradient" onClick={open}>
                {date.toDateString()}
            </Button>
        </div>
        
    );     
}