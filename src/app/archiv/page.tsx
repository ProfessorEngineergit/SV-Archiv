import { getAllProtocols, getAllProjects, getAllTags } from "@/lib/protocols";
import ArchiveClient from "./ArchiveClient";

export const metadata = {
  title: "Archiv | SV-Archiv",
  description: "Durchsuche alle öffentlichen Protokolle und Dokumente im SV-Archiv",
};

export default function ArchivePage() {
  const protocols = getAllProtocols();
  const projects = getAllProjects();
  const tags = getAllTags();

  return (
    <ArchiveClient protocols={protocols} projects={projects} tags={tags} />
  );
}
