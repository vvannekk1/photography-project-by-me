import fs from "fs";
import path from "path";
import { Location, Session } from "./types";

// Reads the 15 location listings from the JSON data file
export function getLocations(): Location[] {
  const file = fs.readFileSync(
    path.join(process.cwd(), "data", "locations.json"),
    "utf-8"
  );
  return JSON.parse(file);
}

// Turns "Ha'penny Bridge" into "ha-penny-bridge" for URLs
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getLocationBySlug(slug: string): Location | undefined {
  return getLocations().find((l) => slugify(l.name) === slug);
}

// Parses the 220-row sessions CSV into typed objects
export function getSessions(): Session[] {
  const file = fs.readFileSync(
    path.join(process.cwd(), "data", "sessions.csv"),
    "utf-8"
  );
  const lines = file.trim().split("\n");
  return lines.slice(1).map((line) => {
    const [
      session_id, location_name, genre, time_of_day,
      weather, crowd_level, month, session_rating,
    ] = line.split(",");
    return {
      session_id: Number(session_id),
      location_name,
      genre,
      time_of_day,
      weather,
      crowd_level: Number(crowd_level),
      month: Number(month),
      session_rating: Number(session_rating),
    };
  });
}
