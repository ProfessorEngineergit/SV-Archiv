import fs from "fs";
import path from "path";
import { parseTermineFile, SVStunde } from "./schedule";

const TERMINE_FILE = path.join(process.cwd(), "public", "data", "termine.txt");

/**
 * Read and parse the termine.txt file from public/data
 * Returns empty array if file doesn't exist
 */
export function getTermine(): SVStunde[] {
  try {
    if (!fs.existsSync(TERMINE_FILE)) {
      console.warn("⚠️  termine.txt not found");
      return [];
    }

    const content = fs.readFileSync(TERMINE_FILE, "utf8");
    return parseTermineFile(content);
  } catch (error) {
    console.error("❌ Error reading termine.txt:", error);
    return [];
  }
}
