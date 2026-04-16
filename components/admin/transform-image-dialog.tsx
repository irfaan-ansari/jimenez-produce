"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import Cropper from "react-easy-crop";
import { RotateCw, History, Loader } from "lucide-react";

type CroppedPixelType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

async function getCroppedImage({
  imageSrc,
  croppedAreaPixels,
  rotation = 0,
}: {
  imageSrc: string;
  croppedAreaPixels: CroppedPixelType;
  rotation: number;
}): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No canvas context");

  const rotRad = (rotation * Math.PI) / 180;

  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const bBoxWidth =
    Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height);

  const bBoxHeight =
    Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -width / 2, -height / 2);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) throw new Error("No cropped canvas context");

  const scaleX = width / image.width;
  const scaleY = height / image.height;

  const cropX = croppedAreaPixels.x * scaleX;
  const cropY = croppedAreaPixels.y * scaleY;
  const cropWidth = croppedAreaPixels.width * scaleX;
  const cropHeight = croppedAreaPixels.height * scaleY;

  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  croppedCtx.drawImage(
    canvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export const TransformImageDialog = ({
  title,
  url,
  children,
  onSave,
}: {
  title: string;
  url: string;
  children: React.ReactNode;
  onSave: (file: File) => Promise<void>;
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = React.useState<CroppedPixelType | null>(
    null
  );

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const reset = () => {
    setRotation(0);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!croppedArea) return;
    setLoading(true);

    try {
      const blob = await getCroppedImage({
        imageSrc: url,
        croppedAreaPixels: croppedArea,
        rotation,
      });

      const file = new File([blob], `edited-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      await onSave(file);
      setOpen(false);
    } catch (err: any) {
      toast.message(err?.message ?? "Failed to transform file.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!croppedArea) return;

    const generatePreview = async () => {
      try {
        const blob = await getCroppedImage({
          imageSrc: url,
          croppedAreaPixels: croppedArea,
          rotation,
        });

        const preview = URL.createObjectURL(blob);
        setPreviewUrl(preview);
      } catch (err) {
        console.error(err);
      }
    };

    generatePreview();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [croppedArea, rotation, zoom]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="overflow-hidden rounded-2xl sm:max-w-xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {previewUrl && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground uppercase">
              Preview
            </p>

            <div className="flex items-center justify-center rounded-xl border bg-background p-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[200px] rounded-lg object-contain"
              />
            </div>
          </div>
        )}
        {/* croper */}
        <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-secondary">
          <Cropper
            image={url}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, croppedAreaPixels) =>
              setCroppedArea(croppedAreaPixels)
            }
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4  rounded-xl">
          <Button variant="outline" className="rounded-xl" onClick={reset}>
            <History />
            Reset
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setRotation((r) => r + 90)}
          >
            <RotateCw /> Rotate
          </Button>

          {/* Zoom */}
          <div className="flex-1">
            <p className="mb-1.5 text-xs text-muted-foreground uppercase">
              Zoom
            </p>
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>
        </div>
        <DialogFooter className="mt-4 gap-4">
          <DialogClose asChild>
            <Button
              onClick={() => console.log("save")}
              className="min-w-28 rounded-xl"
              size="xl"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={!croppedArea || loading}
            className="min-w-28 rounded-xl"
            size="xl"
          >
            {loading ? <Loader className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
