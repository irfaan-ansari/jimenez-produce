import Image from "next/image";
import { Tooltip } from "../tooltip";
import { Button } from "../ui/button";
import { getFileType } from "@/lib/utils";
import { upload } from "@vercel/blob/client";
import { Eye, FileText, SquarePen } from "lucide-react";
import { TransformImageDialog } from "./transform-image-dialog";
import { deleteBlob } from "@/server/blob";

export const Attachment = ({
  url,
  label,
  onUpdate,
}: {
  url: string;
  label: string;
  onUpdate?: (newUrl: string) => Promise<void>;
}) => {
  if (!url) return;

  const type = getFileType(url);

  const hanldeSave = async (file: File) => {
    if (type !== "image") return;

    const [uploaded, _] = await Promise.all([
      upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      }),
      deleteBlob(url),
    ]);

    await onUpdate?.(uploaded.url);
  };

  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-6">
      {type === "image" ? (
        <Image
          src={url}
          width={50}
          height={50}
          alt={label}
          className="aspect-square size-10 rounded-xl border"
        />
      ) : (
        <span className="flex-center inline-flex size-10 items-center justify-center rounded-xl border bg-secondary">
          <FileText className="text-muted-foreground" />
        </span>
      )}
      <span>{label}</span>
      <div className="ml-auto flex gap-2">
        {type === "image" && (
          <TransformImageDialog url={url!} title={label} onSave={hanldeSave}>
            <Button size="icon-sm" className="rounded-xl " variant="outline">
              <Tooltip content="Edit">
                <SquarePen />
              </Tooltip>
            </Button>
          </TransformImageDialog>
        )}
        <Tooltip content="View">
          <Button
            asChild
            size="icon-sm"
            className="rounded-xl"
            variant="outline"
            disabled={!url}
          >
            <a href={url} target="_blank">
              <Eye />
            </a>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
