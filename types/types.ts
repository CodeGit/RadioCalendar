export type Station = {
  name: string;
  key: string;
  id: string;
  weekURL: string;
  dayURL: string;
};

export type Event = {
  start: number;
  end: number;
  duration: number;
};

export type Programme = {
  title: string;
  subtitle?: string;
  synopsis?: string;
  episode?: number;
  episode_total?: number;
  pid: string;
  station?: Station;
  url: string;
  image?: string;
  time: Event;
};

export type DaySchedule = {
  day: number;
  month: number;
  year: number;
  programmes: Programme[];
};

export type WeekSchedule = {
  days: DaySchedule[];
}