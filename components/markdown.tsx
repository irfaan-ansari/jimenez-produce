import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const Markdown = async ({
  className,
  content,
}: {
  className?: string;
  content: string;
}) => {
  return (
    <div
      className={cn(
        "prose max-w-full text-pretty dark:prose-invert [&_ul]:pl-4 [&_li]:pl-0",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Markdown;
