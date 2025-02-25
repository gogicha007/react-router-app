export const FileDownloader = ({
  fileName,
  fileContent,
}: {
  fileName: string;
  fileContent: string | null;
}) => {
  if (!fileContent) return null;

  const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  return (
    <a
      href={url}
      download={fileName}
      style={{ display: 'none' }}
      id="csvDownloadLink"
    >
      Download CSV
    </a>
  );
};
