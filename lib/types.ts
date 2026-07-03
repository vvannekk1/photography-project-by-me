export type Location = {
  name: string;
  description: string;
  genres: string[];
  best_time: string;
  access: string;
  latitude: number;
  longitude: number;
};

export type Session = {
  session_id: number;
  location_name: string;
  genre: string;
  time_of_day: string;
  weather: string;
  crowd_level: number;
  month: number;
  session_rating: number;
};
