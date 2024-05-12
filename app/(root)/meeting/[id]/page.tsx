"use client";

import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import Loader from "@/components/Loader";

const Page = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();

  const { call, isCallLoading } = useGetCallById(params.id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-center text-3xl font-bold text-white">
          Call Not Found
        </p>
      </div>
    );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom id={params.id} user={user} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Page;
