import { google, drive_v3 } from "googleapis";
import * as fs from "fs-extra";
import * as path from "path";
import slugify from "slugify";

// Directories
const DOWNLOADS_DIR = path.join(__dirname, "..", "public", "downloads");
const DATA_DIR = path.join(__dirname, "..", "public", "data");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

// Types
interface FileMetadata {
  title: string;
  date: string;
  slug: string;
  file: string;
  updatedAt: string;
}

interface MetaFile {
  md5Checksum: string;
  driveId: string;
  originalName: string;
}

/**
 * Parse filename like "SV-Protokoll 25.11.2025.pdf" or "SV-Protokoll vom 19.1.2026.pdf"
 * Returns: { title: "Protokoll vom DD.MM.YYYY", date: "2025-11-25", slug: "sv-protokoll-2025-11-25" }
 */
function parseFileName(
  fileName: string
): { title: string; date: string; slug: string } | null {
  // Match pattern: "Title [vom] D.M.YYYY.pdf" or "Title [vom] DD.MM.YYYY.pdf"
  const regex = /^(.+?)\s+(?:vom\s+)?(\d{1,2})\.(\d{1,2})\.(\d{4})\.pdf$/i;
  const match = fileName.match(regex);

  if (!match) {
    console.warn(`⚠️  Could not parse filename: ${fileName}`);
    return null;
  }

  const [, title, dayRaw, monthRaw, year] = match;

  // Pad day and month to 2 digits
  const day = dayRaw.padStart(2, "0");
  const month = monthRaw.padStart(2, "0");

  // Convert to ISO date format: YYYY-MM-DD
  const date = `${year}-${month}-${day}`;

  // Create slug: title-YYYY-MM-DD (lowercase, slugified)
  const titleSlug = slugify(title, { lower: true, strict: true });
  const slug = `${titleSlug}-${year}-${month}-${day}`;

  // Create title in format "Protokoll vom DD.MM.YYYY"
  const formattedTitle = `Protokoll vom ${day}.${month}.${year}`;

  return { title: formattedTitle, date, slug };
}

/**
 * Initialize Google Drive API client
 */
function getDriveClient(): drive_v3.Drive {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable");
  }

  const credentials = JSON.parse(serviceAccountJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

/**
 * List all PDF files in the Drive folder
 */
async function listDriveFiles(
  drive: drive_v3.Drive,
  folderId: string
): Promise<drive_v3.Schema$File[]> {
  const files: drive_v3.Schema$File[] = [];
  let pageToken: string | undefined;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: "nextPageToken, files(id, name, md5Checksum, modifiedTime)",
      pageSize: 100,
      pageToken,
    });

    if (response.data.files) {
      files.push(...response.data.files);
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return files;
}

/**
 * Download a file from Google Drive
 */
async function downloadFile(
  drive: drive_v3.Drive,
  fileId: string,
  destPath: string
): Promise<void> {
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  await fs.ensureDir(path.dirname(destPath));

  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(destPath);
    (response.data as NodeJS.ReadableStream)
      .pipe(dest)
      .on("finish", resolve)
      .on("error", reject);
  });
}

/**
 * Read meta file for a given slug
 */
async function readMetaFile(slug: string): Promise<MetaFile | null> {
  const metaPath = path.join(DOWNLOADS_DIR, `${slug}.pdf.meta.json`);

  if (await fs.pathExists(metaPath)) {
    return fs.readJson(metaPath);
  }

  return null;
}

/**
 * Write meta file for a given slug
 */
async function writeMetaFile(slug: string, meta: MetaFile): Promise<void> {
  const metaPath = path.join(DOWNLOADS_DIR, `${slug}.pdf.meta.json`);
  await fs.writeJson(metaPath, meta, { spaces: 2 });
}

/**
 * Main sync function
 */
async function syncDrive(): Promise<void> {
  console.log("🔄 Starting Google Drive sync...\n");

  // Check environment variables
  const folderId = process.env.DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("Missing DRIVE_FOLDER_ID environment variable");
  }

  // Ensure directories exist
  await fs.ensureDir(DOWNLOADS_DIR);
  await fs.ensureDir(DATA_DIR);

  // Initialize Drive client
  const drive = getDriveClient();

  // List files in Drive folder
  console.log("📂 Fetching files from Google Drive...");
  const driveFiles = await listDriveFiles(drive, folderId);
  console.log(`   Found ${driveFiles.length} PDF file(s)\n`);

  // Warn if no files found (but don't crash)
  if (driveFiles.length === 0) {
    console.warn("⚠️  No PDF files found in the specified Drive folder.");
    console.warn("   Check that DRIVE_FOLDER_ID is correct and the folder contains PDFs.");
  }

  // Process each file
  const indexEntries: FileMetadata[] = [];

  for (const driveFile of driveFiles) {
    const { id, name, md5Checksum, modifiedTime } = driveFile;

    if (!id || !name || !md5Checksum || !modifiedTime) {
      console.warn(`⚠️  Skipping file with missing metadata: ${name}`);
      continue;
    }

    // Parse filename
    const parsed = parseFileName(name);
    if (!parsed) {
      continue;
    }

    const { title, date, slug } = parsed;
    const localPath = path.join(DOWNLOADS_DIR, `${slug}.pdf`);
    const filePath = `/downloads/${slug}.pdf`;

    // Check if file needs to be downloaded
    const existingMeta = await readMetaFile(slug);
    const needsDownload =
      !existingMeta || existingMeta.md5Checksum !== md5Checksum;

    if (needsDownload) {
      console.log(`⬇️  Downloading: ${name}`);
      console.log(`   → ${filePath}`);

      await downloadFile(drive, id, localPath);
      await writeMetaFile(slug, {
        md5Checksum,
        driveId: id,
        originalName: name,
      });

      console.log(`   ✅ Done\n`);
    } else {
      console.log(`⏭️  Unchanged: ${name}\n`);
    }

    // Add to index
    indexEntries.push({
      title,
      date,
      slug,
      file: filePath,
      updatedAt: modifiedTime,
    });
  }

  // Sort by date (newest first)
  indexEntries.sort((a, b) => b.date.localeCompare(a.date));

  // Write index.json
  await fs.writeJson(INDEX_FILE, indexEntries, { spaces: 2 });
  console.log(`📄 Updated ${INDEX_FILE}`);
  console.log(`   ${indexEntries.length} file(s) in index\n`);

  console.log("✅ Sync complete!");
}

// Run
syncDrive().catch((error) => {
  console.error("❌ Sync failed:", error.message);
  process.exit(1);
});
