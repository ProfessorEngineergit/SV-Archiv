// FS (Fachstunde) to time mapping
export interface FSTimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export const FS_TIME_MAP: Record<string, FSTimeRange> = {
  HU: { start: "08:00", end: "09:40" },
  "1": { start: "10:00", end: "10:45" },
  "2": { start: "10:50", end: "11:35" },
  "3": { start: "11:55", end: "12:40" },
  "4": { start: "12:45", end: "13:30" },
  "5": { start: "13:30", end: "14:15" },
  "6": { start: "14:15", end: "15:00" },
  "7": { start: "15:00", end: "15:45" },
  "8": { start: "15:45", end: "16:30" },
};

export interface SVStunde {
  date: Date; // Full datetime of the SV-Stunde START
  endDate: Date; // Full datetime of the SV-Stunde END
  dateString: string; // Original date string like "Mo 19.01"
  fs: string; // FS number like "3.FS", "6.FS"
  rawLine: string; // Original line from the file
}

/**
 * Parse termine.txt format line like "- Mo 19.01 3.FS"
 * Returns null if format doesn't match
 */
export function parseTermineLine(line: string, currentYear: number): SVStunde | null {
  // Match format: "- Day DD.MM [FS#]"
  // Examples: "- Mo 19.01 3.FS", "- Di 27.01 6.FS", "- Do 05.02 3. FS"
  const regex = /^-\s*\w+\s+(\d{1,2})\.(\d{1,2})\s+(\d+)\.?\s*FS/i;
  const match = line.trim().match(regex);

  if (!match) {
    return null;
  }

  const [, dayStr, monthStr, fs] = match;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  // Determine year - if month is before current month, it's next year
  const now = new Date();
  let year = currentYear;
  
  // If the month has passed this year, assume next year
  if (month < now.getMonth() + 1) {
    year = currentYear + 1;
  }

  // Get the time range for this FS
  const timeRange = FS_TIME_MAP[fs];
  if (!timeRange) {
    console.warn(`Unknown FS number: ${fs}`);
    return null;
  }

  // Parse start and end times
  const [startHours, startMinutes] = timeRange.start.split(":").map(Number);
  const [endHours, endMinutes] = timeRange.end.split(":").map(Number);
  
  // Create date in Europe/Berlin timezone
  const date = new Date(year, month - 1, day, startHours, startMinutes, 0);
  const endDate = new Date(year, month - 1, day, endHours, endMinutes, 0);

  return {
    date,
    endDate,
    dateString: `${dayStr}.${monthStr.padStart(2, "0")}`,
    fs: `${fs}.FS`,
    rawLine: line.trim(),
  };
}

/**
 * Parse termine.txt content and return array of SVStunden
 */
export function parseTermineFile(content: string): SVStunde[] {
  const lines = content.split("\n");
  const currentYear = new Date().getFullYear();
  const stunden: SVStunde[] = [];

  for (const line of lines) {
    const parsed = parseTermineLine(line, currentYear);
    if (parsed) {
      stunden.push(parsed);
    }
  }

  // Sort by date
  stunden.sort((a, b) => a.date.getTime() - b.date.getTime());

  return stunden;
}

/**
 * Check if a session is currently in progress
 */
export function isSessionInProgress(stunde: SVStunde): boolean {
  const now = new Date();
  return now >= stunde.date && now < stunde.endDate;
}

/**
 * Find the next SV-Stunde from now (or current if in progress)
 */
export function getNextSVStunde(stunden: SVStunde[]): SVStunde | null {
  const now = new Date();
  
  for (const stunde of stunden) {
    // If session is in progress or hasn't started yet
    if (stunde.endDate > now) {
      return stunde;
    }
  }
  
  return null;
}

/**
 * Calculate seconds until the end of the SV-Stunde
 * If session is in progress, counts to end time
 * If session hasn't started, counts to start time first
 */
export function getSecondsUntilNext(nextStunde: SVStunde | null): number {
  if (!nextStunde) {
    return 0;
  }

  const now = new Date();
  
  // If session is in progress, count to end time
  if (isSessionInProgress(nextStunde)) {
    const diff = nextStunde.endDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  }
  
  // Otherwise count to start time
  const diff = nextStunde.date.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / 1000));
}

/**
 * Format date for display: "Montag, 19.01.2026 um 11:55 Uhr (3.FS)"
 */
export function formatSVStundeDisplay(stunde: SVStunde): string {
  const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const weekday = weekdays[stunde.date.getDay()];
  
  const day = stunde.date.getDate().toString().padStart(2, "0");
  const month = (stunde.date.getMonth() + 1).toString().padStart(2, "0");
  const year = stunde.date.getFullYear();
  
  const hours = stunde.date.getHours().toString().padStart(2, "0");
  const minutes = stunde.date.getMinutes().toString().padStart(2, "0");
  
  return `${weekday}, ${day}.${month}.${year} um ${hours}:${minutes} Uhr (${stunde.fs})`;
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} Sekunde${seconds !== 1 ? "n" : ""}`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} Minute${minutes !== 1 ? "n" : ""} und ${secs} Sekunde${secs !== 1 ? "n" : ""}`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} Stunde${hours !== 1 ? "n" : ""} und ${minutes} Minute${minutes !== 1 ? "n" : ""}`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days} Tag${days !== 1 ? "e" : ""} und ${hours} Stunde${hours !== 1 ? "n" : ""}`;
}
