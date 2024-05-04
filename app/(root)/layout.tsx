import StreamVideoProvider from "@/providers/StreamClientProvider";

const RoomLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RoomLayout;
