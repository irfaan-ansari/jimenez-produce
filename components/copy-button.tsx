"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

type CopyRenderProps = {
  value: string;
  copied: boolean;
  copy: () => Promise<void>;
};

type CopyProps = {
  value: string;

  render?: (props: CopyRenderProps) => React.ReactNode;
  className?: string;
};

export function CopyButton({ value, render, className }: CopyProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };
  if (!value) return null;
  if (render) {
    return <>{render({ value, copied, copy })}</>;
  }

  return (
    <div
      className={`flex items-center gap-1 hover:*:data-[slot=button]:opacity-100 ${className}`}
    >
      <span className="text-sm text-muted-foreground">{value}</span>
      <Button
        onClick={copy}
        size="icon-xs"
        variant="ghost"
        className="rounded-md border text-sm opacity-0"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
