export type Station = {
  name: string;
  key: string;
  id: string;
  week: string;
  day: string;
  programme: string;
  play: string;
};

export type Event = {
  start: number;
  end: number;
  duration: number;
};

export type Programme = {
  title: string;
  subtitle?: string;
  description?: string;
  synopsis?: string;
  episode?: number;
  episode_total?: number;
  pid: string;
  station?: Station;
  url: string;
  image?: string;
  time: Event;
  series?: string;
  selected?: boolean;
  online?: boolean;
  recorded?: boolean;
  recordedTime?: number;
  file?: Text;
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