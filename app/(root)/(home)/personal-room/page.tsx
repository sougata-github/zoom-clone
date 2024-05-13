"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// const randomId = crypto.randomUUID();

const Table = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
      <h1 className="text-lg font-bold text-blue-1 lg:text-xl">{title}</h1>
      <h1 className="max-md:max-w-[300px] truncate text-sm font-semibold lg:text-lg">
        {description}
      </h1>
      {children}
    </div>
  );
};

const Page = () => {
  const { user } = useUser();

  const router = useRouter();

  const meetingId = `${user?.firstName?.toLowerCase()}_${user?.id}`;

  // const { call } = useGetCallById(meetingId);
  const client = useStreamVideoClient();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const [copied, setIsCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId);

    await newCall.create({
      data: {
        starts_at: new Date().toISOString(),
      },
    });

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table
          title="Topic:"
          description={`${user?.firstName}'s Meeting Room`}
        />
        <Table title="Meeting ID:" description={`${meetingId}`} />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-1 hover:bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="rounded-lg bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-all"
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default Page;
