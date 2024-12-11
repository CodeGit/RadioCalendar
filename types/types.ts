export type Station = {
    name: string,
    key: string,
    id: string,
    weekURL: string,
    dayURL: string
};

export type Event = {
    start: Date,
    end: Date,
    duration: number,
};

export type Programme = {
    title: string,
    subtitle: string,
    synopsis: string,
    episode: number,
    pid: string,
    station: Station,
    url: string,
    series: string,
    time: Event
};

export type DaySchedule = {
    day: number,
    month: number,
    year: number,
    week: number
    programmes: Programme[]
};

export type WeekSchedule = {
    week: number,
    year: number,
    [day: number]: DaySchedule
};
