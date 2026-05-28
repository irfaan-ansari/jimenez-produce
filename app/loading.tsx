import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
};

export default Loading;
