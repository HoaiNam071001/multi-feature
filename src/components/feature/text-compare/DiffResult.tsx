import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import I18n from "@/components/utils/I18n";
import {
    useDiffViewer,
    useDiffViewerCompareByLine,
} from "@/hooks/useDiffViewer";

interface DiffViewerProps {
  text1: string;
  text2: string;
}

export const InlineDiffViewer = ({ text1, text2 }: DiffViewerProps) => {
  const { diffHtml } = useDiffViewer(text1, text2);

  if (!text1 && !text2) {
    return (
      <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-full">
        <pre className="text-gray-400">Empty</pre>
      </div>
    );
  }
  return (
    <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-full">
      <pre
        className="whitespace-pre-wrap font-sans"
        dangerouslySetInnerHTML={{ __html: diffHtml }}
      />
    </div>
  );
};

export const SideBySideDiffViewer: React.FC<DiffViewerProps> = ({
  text1,
  text2,
}: DiffViewerProps) => {
  const { oldHtml, newHtml } = useDiffViewerCompareByLine(text1, text2);
  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-64">
          <pre
            className="whitespace-pre-wrap font-sans"
            dangerouslySetInnerHTML={{ __html: oldHtml }}
          />
        </div>
      </div>

      <div className="w-1/2">
        <div className="text-sm p-2 bg-gray-100 rounded-md overflow-auto h-64">
          <pre
            className="whitespace-pre-wrap font-sans"
            dangerouslySetInnerHTML={{ __html: newHtml }}
          />
        </div>
      </div>
    </div>
  );
};

export const DiffViewerTabs = ({ text1, text2 }: DiffViewerProps) => {
  return (
    <>
      <Tabs defaultValue="inline" className="mt-4">
        <TabsList className="mb-2">
          <TabsTrigger value="inline">
            <I18n value="Inline" />
          </TabsTrigger>
          <TabsTrigger value="sideBySide">
            <I18n value="Side by Side" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inline">
          <InlineDiffViewer text1={text1} text2={text2} />
        </TabsContent>
        <TabsContent value="sideBySide">
          <SideBySideDiffViewer text1={text1} text2={text2} />
        </TabsContent>
      </Tabs>
    </>
  );
};
