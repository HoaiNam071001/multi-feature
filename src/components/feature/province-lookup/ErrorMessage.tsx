import { Globe } from "lucide-react";
import { I18n } from "@/components/utils/I18n";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-yellow-600" />
        <span className="text-yellow-800 text-sm">
          <I18n value="error.api.failed" />
        </span>
      </div>
    </div>
  );
};

export default ErrorMessage;
