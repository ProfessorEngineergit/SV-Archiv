import fs from "fs";
import path from "path";

const INDEX_FILE = path.join(process.cwd(), "public", "data", "index.json");

// Interface for Drive-synced protocol data from index.json
interface DriveProtocolData {
  title: string;
  date: string;
  slug: string;
  file: string;
  updatedAt: string;
}

export interface ProtocolMetadata {
  title: string;
  date: string;
  project: string;
  tags: string[];
  version: number;
  visibility: string;
  slug: string;
  file?: string;
}

export interface Protocol extends ProtocolMetadata {
  content: string;
  htmlContent: string;
}

// Get all protocol metadata for the archive list
export function getAllProtocols(): ProtocolMetadata[] {
  // Check if index.json exists
  if (!fs.existsSync(INDEX_FILE)) {
    console.warn("⚠️  index.json not found, returning empty array");
    return [];
  }

  try {
    // Read the Drive-synced index.json
    const indexData = fs.readFileSync(INDEX_FILE, "utf8");
    const driveProtocols: DriveProtocolData[] = JSON.parse(indexData);

    // Map Drive data structure to ProtocolMetadata structure
    return driveProtocols.map((item) => ({
      slug: item.slug,
      title: item.title || "Untitled",
      date: item.date || "",
      project: "",  // Drive data doesn't have projects
      tags: [],     // Drive data doesn't have tags
      version: 1,   // Drive data doesn't have versions
      visibility: "public",  // All Drive files are public
      file: item.file,  // PDF file path
    }));
  } catch (error) {
    console.error("❌ Error reading index.json:", error);
    return [];
  }
}

// Get all unique projects
export function getAllProjects(): string[] {
  const protocols = getAllProtocols();
  const projects = new Set<string>();
  
  protocols.forEach((protocol) => {
    if (protocol.project) {
      projects.add(protocol.project);
    }
  });
  
  return Array.from(projects).sort();
}

// Get all unique tags
export function getAllTags(): string[] {
  const protocols = getAllProtocols();
  const tags = new Set<string>();
  
  protocols.forEach((protocol) => {
    protocol.tags.forEach((tag) => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

// Get a single protocol by slug with full content
export async function getProtocolBySlug(slug: string): Promise<Protocol | null> {
  try {
    // Read the Drive-synced index.json to find the protocol
    if (!fs.existsSync(INDEX_FILE)) {
      return null;
    }

    const indexData = fs.readFileSync(INDEX_FILE, "utf8");
    const driveProtocols: DriveProtocolData[] = JSON.parse(indexData);
    
    // Find the protocol by slug
    const item = driveProtocols.find((p) => p.slug === slug);
    
    if (!item) {
      return null;
    }

    return {
      slug: item.slug,
      title: item.title || "Untitled",
      date: item.date || "",
      project: "",
      tags: [],
      version: 1,
      visibility: "public",
      file: item.file,
      content: "",  // PDF files don't have text content
      htmlContent: "",  // PDF files don't have HTML content
    };
  } catch {
    return null;
  }
}

// Get all slugs for static generation
export function getAllProtocolSlugs(): string[] {
  // Check if index.json exists
  if (!fs.existsSync(INDEX_FILE)) {
    return [];
  }

  try {
    const indexData = fs.readFileSync(INDEX_FILE, "utf8");
    const driveProtocols: DriveProtocolData[] = JSON.parse(indexData);
    return driveProtocols.map((item) => item.slug);
  } catch {
    return [];
  }
}
