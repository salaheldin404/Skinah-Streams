import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message }: { message?: string }) => (
  <div
    className={`grid transition-all duration-300 ease-in-out ${
      message
        ? "grid-rows-[1fr] opacity-100 mt-1"
        : "grid-rows-[0fr] opacity-0 mt-0"
    }`}
  >
    <div className="overflow-hidden">
      <p className="text-red-500 text-xs flex items-center gap-1.5">
        <AlertCircle size={14} className="shrink-0" />
        <span>{message}</span>
      </p>
    </div>
  </div>
);

export default ErrorMessage;