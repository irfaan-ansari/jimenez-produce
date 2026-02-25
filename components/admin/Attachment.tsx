import Image from "next/image";
import { getFileType } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";
import { Button } from "../ui/button";

export const Attachment = ({ url, label }: { url: string; label: string }) => {
  const type = getFileType(url);

  return (
    <div className="flex gap-4 items-center py-4 first:pt-0 last:pb-6">
      {type === "image" ? (
        <Image
          src={url}
          width={50}
          height={50}
          alt={label}
          className="aspect-square size-10 rounded-xl border"
        />
      ) : (
        <span className="size-10 bg-secondary border rounded-xl inline-flex flex-center justify-center items-center">
          <FileText className="text-muted-foreground" />
        </span>
      )}
      <span>{label}</span>
      <Button
        asChild
        size="icon-sm"
        className="rounded-xl ml-auto"
        variant="outline"
        disabled={!url}
      >
        <a href={url} target="_blank">
          <Eye />
        </a>
      </Button>
    </div>
  );
};
