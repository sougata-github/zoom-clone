import StreamVideoProvider from "@/providers/StreamClientProvider";

const RoomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </>
  );
};

export default RoomLayout;
