"use client";

import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";

import { Users, Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = ({ id, user }: { id: string; user: any }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");

  const [copied, setIsCopied] = useState(false);

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const url = `${window.origin}/meeting/${id}`;

  const call = useCall();

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // const CallLayout = () => {
  //   switch (layout) {
  //     case "grid":
  //       return <PaginatedGridLayout />;
  //     case "speaker-right":
  //       return <SpeakerLayout participantsBarPosition="left" />;
  //     default:
  //       return <SpeakerLayout participantsBarPosition="right" />;
  //   }
  // };

  const updateMemberList = async () => {
    await call?.updateCallMembers({ update_members: [{ user_id: user?.id }] });
  };

  useEffect(() => {
    if (callingState === CallingState.LEFT) return redirect("/");

    if (callingState === CallingState.JOINED) {
      updateMemberList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callingState]);

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <PaginatedGridLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="flex-wrap fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push("/")} />

        {/* <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          {!isMobile && (
            <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <Users size={20} className="text-white" />
            </div>
          )}
        </button>
        {!isMobile && (
          <Button
            className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-all"
            onClick={onCopy}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy Invite Link
              </>
            )}
          </Button>
        )}

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
