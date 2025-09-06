interface DiffResultProps {
  diffHtml: string;
}

export const DiffResult = ({ diffHtml }: DiffResultProps) => {
  if (!diffHtml) return null;

  return (
    <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-full mt-4">
      <pre
        className="whitespace-pre-wrap font-sans"
        dangerouslySetInnerHTML={{ __html: diffHtml }}
      />
      
    </div>
  );
};
