import React from "react";
import { useEffect, useState, Suspense, useContext } from "react";
import { Modal, Button, Chip, Skeleton } from '@mantine/core';
import { Station } from "../../types/types.ts";

interface StationSelectorProps {
    stations: Station[],
}

const StationSelector = ({stations}:StationSelectorProps) => {
    
    return (
        <>
            <Button>{stations && stations.length > 0 ? stations[0].name : "blank"}</Button>
        </>
    );
};

export default StationSelector;
