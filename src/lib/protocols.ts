import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const protocolsDirectory = path.join(process.cwd(), "content/protocols");

export interface ProtocolMetadata {
  title: string;
  date: string;
  project: string;
  tags: string[];
  version: number;
  visibility: string;
  slug: string;
}

export interface Protocol extends ProtocolMetadata {
  content: string;
  htmlContent: string;
}

// Generate slug from filename (remove date prefix and extension)
function generateSlug(filename: string): string {
  return filename.replace(/\.md$/, "");
}

// Get all protocol metadata for the archive list
export function getAllProtocols(): ProtocolMetadata[] {
  const fileNames = fs.readdirSync(protocolsDirectory);
  
  const protocols = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = generateSlug(fileName);
      const fullPath = path.join(protocolsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        project: data.project || "",
        tags: data.tags || [],
        version: data.version || 1,
        visibility: data.visibility || "public",
      } as ProtocolMetadata;
    })
    .filter((protocol) => protocol.visibility === "public");

  // Sort by date (newest first)
  return protocols.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
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
    const fullPath = path.join(protocolsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const htmlContent = processedContent.toString();

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      project: data.project || "",
      tags: data.tags || [],
      version: data.version || 1,
      visibility: data.visibility || "public",
      content,
      htmlContent,
    };
  } catch {
    return null;
  }
}

// Get all slugs for static generation
export function getAllProtocolSlugs(): string[] {
  const fileNames = fs.readdirSync(protocolsDirectory);
  
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => generateSlug(fileName));
}
