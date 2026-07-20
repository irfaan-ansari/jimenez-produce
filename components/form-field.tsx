"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useFieldContext } from "@/hooks/form-context";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldTitle,
} from "@/components/ui/field";
import {
  ChevronDownIcon,
  Calendar as CalendarIcon,
  Eraser,
  Paperclip,
  Trash2,
  Upload,
  EyeOff,
  Eye,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { cn, formatPhone } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SignatureCanvas from "react-signature-canvas";
import { addYears, format } from "date-fns";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Textarea } from "./ui/textarea";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { validateDocument } from "@/lib/validate-docoment/validate";

interface FieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  props?: React.ComponentProps<"div" | "input">;
}

const TextField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        // @ts-ignore
        type={props?.type ? props.type : "text"}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const TextAreaField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        className="min-h-24 resize-none"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const PasswordField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>();
  const [show, setShow] = useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <InputGroup className="rounded-xl">
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          type={show ? "text" : "password"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            tabIndex={-1}
            size="icon-sm"
            className="rounded-2xl"
            type="button"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const DateField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const [open, setOpen] = React.useState(false);
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild aria-invalid={isInvalid}>
          <Button
            variant="outline"
            size="xl"
            data-empty={!field.state.value}
            className="justify-start px-2.5 text-sm font-normal aria-invalid:ring-0 data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon />
            {field.state.value || placeholder}
            <ChevronDownIcon className="ml-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            endMonth={addYears(new Date(), 20)}
            onSelect={(date) => {
              const dateStr = format(date as Date, "yyyy-MM-dd");
              field.handleChange(dateStr);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const SelectField = ({
  label,
  description,
  placeholder,
  className,
  options,
}: FieldProps & { options: string[] }) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field className={cn("gap-2", className)}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select
        name={field.name}
        value={field.state.value as string}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          className="h-11! aria-invalid:ring-0!"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const RadioField = ({
  label,
  description,
  className,
  options,
}: FieldProps & { options: Record<string, string>[] }) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field className={cn("gap-2", className)}>
      {label && (
        <FieldLegend variant="label" className="m-0">
          {label}
        </FieldLegend>
      )}
      <RadioGroup
        name={field.name}
        value={field.state.value as string}
        onValueChange={field.handleChange}
        className="flex"
      >
        {options.map((opt) => {
          const id = `${field.name}-${opt.value}`;
          return (
            <FieldLabel htmlFor={id} key={`field-label-${opt.value}`}>
              <Field orientation="horizontal" className="gap-4">
                <FieldContent>
                  <FieldTitle>{opt.label}</FieldTitle>
                  <FieldDescription>{opt.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={opt.value} id={id} />
              </Field>
            </FieldLabel>
          );
        })}
      </RadioGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const SignatureField = ({
  label,
  description,

  className,
}: FieldProps) => {
  const field = useFieldContext();
  const canvasRef = useRef<SignatureCanvas>(null);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const clear = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.clear();
    field.handleChange(undefined);
    field.validate("blur");
  };

  const handleChange = async () => {
    const file = await canvasToFile(
      canvasRef.current?.getTrimmedCanvas() as HTMLCanvasElement,
    );

    field.handleChange(file);
    field.validate("blur");
  };

  /**
   * convert canvas to file
   * @param canvas
   * @returns
   */
  function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject("Not a blob");
          return;
        }

        resolve(new File([blob], "signature.png", { type: "image/png" }));
      });
    });
  }

  return (
    <Field className={cn("gap-2", className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative border border-dashed p-2">
        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{ className: "w-full h-36 bg-secondary block" }}
          onEnd={handleChange}
        />
        <Button
          size="sm"
          variant="outline"
          className="absolute top-4 right-4"
          onClick={clear}
          type="button"
        >
          <Eraser />
          Clear
        </Button>
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const FileField = ({ label, description, className }: FieldProps) => {
  const field = useFieldContext<File>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field className={className}>
      <FieldLegend variant="label" className="m-0">
        {label}
      </FieldLegend>
      <FieldLabel
        htmlFor={field.name}
        className={`h-11 px-4 border border-primary border-dashed bg-primary/20 relative`}
      >
        {field.state.value ? (
          <>
            <Paperclip className="size-4 shrink-0" />
            <span className="truncate">{field.state.value?.name}</span>
            <Button
              variant="outline"
              type="button"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={(e) => {
                e.preventDefault();
                field.handleChange(undefined as any);
              }}
            >
              <Trash2 />
            </Button>
          </>
        ) : (
          <>
            <Upload className="size-4" /> Upload
          </>
        )}

        <Input
          type="file"
          id={field.name}
          onChange={(e) => {
            field.handleChange(e.target.files?.[0] as File);
          }}
          className="opacity-0"
          accept="image/jpeg, image/png, application/pdf"
        />
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
const PhoneField = ({
  label,
  description,
  placeholder,
  className,
  ...props
}: FieldProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const displayValue = formatPhone(field.state.value ?? "");

  return (
    <Field className={cn("gap-2", className)} {...props}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Input
        id={field.name}
        name={field.name}
        value={displayValue}
        onBlur={field.handleBlur}
        {...props}
        onChange={(e) => {
          // store digits only
          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
          field.handleChange(digits);
        }}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        type="tel"
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

const UploadState = ({ status }: { status: string }) => {
  switch (status) {
    case "idle":
      return (
        <div className="space-y-2 text-center flex flex-col items-center">
          <UploadCloud className="size-5" />
          <p className="underline">Click to upload</p>
        </div>
      );
    case "uploading":
      return (
        <div className="space-y-2 text-center flex flex-col items-center">
          <Loader2 className="size-5 animate-spin" />
          <p>Uploading...</p>
        </div>
      );
    case "validating":
      return (
        <div className="space-y-2 text-center flex flex-col items-center">
          <Loader2 className="size-5 animate-spin" />
          <p>Validating...</p>
        </div>
      );
    default:
      return null;
  }
};

const FileFieldNew = ({ label, description, className }: FieldProps) => {
  const field = useFieldContext<string>();

  const [uploadState, setUploadState] = React.useState<{
    status: string;
    file: null | File;
  }>({
    status: "idle",
    file: null,
  });

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleFileChange = async (file?: File) => {
    const fileToUpload = file || uploadState.file;
    if (!fileToUpload) return;
    const toastId = toast.loading("Uploading...");
    try {
      // upload file
      setUploadState((prev) => ({ ...prev, status: "uploading" }));

      const uploaded = await upload(
        `customer/${fileToUpload.name}`,
        fileToUpload,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
        },
      );
      setUploadState((prev) => ({ ...prev, status: "validating" }));
      toast.loading("Validating...", { id: toastId });

      const result = await validateDocument({
        fileUrl: uploaded.url,
        type: field.name,
      });

      if (!result.data.valid) {
        toast.error(result.data.message, { id: toastId });
        throw new Error(result.data.message);
      } else {
        toast.success("File uploaded successfully.", { id: toastId });
        field.setValue(uploaded.url);
      }
    } catch (error: any) {
      field.setMeta((prev) => ({
        ...prev,
        isTouched: true,
        errorMap: {
          onSubmit: [
            { message: error.message ?? "Failed to process the file." },
          ],
        },
      }));
    } finally {
      setUploadState((prev) => ({ ...prev, status: "idle" }));
    }
  };

  return (
    <Field className={className}>
      <FieldLegend className="m-0">{label}</FieldLegend>
      <FieldLabel
        htmlFor={field.name}
        className="relative flex text-muted-foreground min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary bg-primary/10 p-6"
      >
        {field.state.value ? (
          <div className="flex gap-3 items-center">
            <Paperclip className="size-4" /> Uploaded successfully. Click to
            replace.
          </div>
        ) : (
          <UploadState status={uploadState.status} />
        )}

        <Input
          type="file"
          id={field.name}
          className="absolute inset-0 h-full opacity-0 invisible"
          accept="image/jpeg,image/png,application/pdf"
          disabled={uploadState.status !== "idle"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleFileChange(file);
            setUploadState((prev) => ({ ...prev, file }));
          }}
        />
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export {
  TextAreaField,
  TextField,
  DateField,
  SelectField,
  SignatureField,
  RadioField,
  FileField,
  PhoneField,
  PasswordField,
  FileFieldNew,
};
