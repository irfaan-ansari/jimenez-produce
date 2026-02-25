"use client";
import React from "react";
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
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  ChevronDownIcon,
  Calendar as CalendarIcon,
  Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { format } from "date-fns";

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
            className="data-[empty=true]:text-muted-foreground aria-invalid:ring-0 justify-start font-normal px-2.5 text-sm"
          >
            <CalendarIcon />
            {field.state.value || placeholder}
            <ChevronDownIcon className="ml-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
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
          className="h-12! aria-invalid:ring-0!"
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
                <FieldTitle>{opt.label}</FieldTitle>
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
      canvasRef.current?.getTrimmedCanvas() as HTMLCanvasElement
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
      <div className="border p-2 border-dashed relative">
        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{ className: "w-full h-36 bg-secondary block" }}
          onEnd={handleChange}
        />
        <Button
          size="sm"
          variant="outline"
          className="absolute right-4 top-4"
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

export { TextField, DateField, SelectField, SignatureField, RadioField };
