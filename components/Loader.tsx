import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full">
      <Loader2 className="h-10 w-10 animate-spin transiton-all text-white" />
    </div>
  );
};

export default Loader;
