import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = ({
  setCallHasEnded,
}: {
  setCallHasEnded: (value: boolean) => void;
}) => {
  const router = useRouter();

  const call = useCall();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        await call.endCall();
        setCallHasEnded(true);
        router.push("/");
      }}
      className="bg-red-500 hover:bg-red-400 transition-all"
    >
      End Call for everyone
    </Button>
  );
};

export default EndCallButton;
