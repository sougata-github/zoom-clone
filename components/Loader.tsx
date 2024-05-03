import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full">
      <Loader2 className="h-4 w-4 animate-spin transiton-all" />
    </div>
  );
};

export default Loader;
