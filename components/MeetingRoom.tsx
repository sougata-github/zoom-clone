import { cn } from "@/lib/utils";

import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import { Check, Copy, LayoutList, Users } from "lucide-react";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";
import { Button } from "./ui/button";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = ({ id }: { id: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");

  const [copied, setIsCopied] = useState(false);

  const [callhasEnded, setCallHasEnded] = useState(false);

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.LEFT) return redirect("/");
  }, [callingState]);

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  const url = `${window.origin}/meeting/${id}`;

  const onCopy = () => {
    console.log(url);
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn(
            "h-[calc(100vh-86px)] hidden ml-2 transition-all",
            showParticipants && "show-block"
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-2 sm:gap-5 flex-wrap py-1">
        <CallControls
          onLeave={() => {
            router.push("/");
          }}
        />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-all">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="mb-2 border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-all">
            <Users size={20} className="text-white" />
          </div>
        </button>
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
        {!isPersonalRoom && <EndCallButton setCallHasEnded={setCallHasEnded} />}
      </div>
    </section>
  );
};

export default MeetingRoom;
