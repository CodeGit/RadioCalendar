import React from "react";
import { DatePicker, DateValue } from '@mantine/dates';
import { Modal, Chip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { changeDate, selectDate, toggleScheduleMode, fetchByWeek } from "./scheduleSlice.ts";

import { useAppDispatch, useAppSelector } from '../../hooks.tsx';

const DateModal = () => {
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectDate);
    const isFetchByWeek = useAppSelector(fetchByWeek);
    const [opened, {open, close}] = useDisclosure(false);
        
    return(
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
    );
}

export default DateModal;