"use client";

import { useGetUpcomingCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";

import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetEndedCalls } from "@/hooks/useGetEndedCalls";

import MeetingCard from "./MeetingCard";
import LoadingSkeletonCallList from "./LoadingSkeletonCallList";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { upcomingCalls, callRecordings, isLoadingUpcomingCalls } =
    useGetUpcomingCalls();

  const { endedCalls, isLoadingEndedCalls } = useGetEndedCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const router = useRouter();

  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          endedCalls?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Try again later!",
        });
      }
    };

    if (type === "recordings") {
      fetchRecordings();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallMessage();

  if (isLoadingUpcomingCalls || isLoadingEndedCalls)
    return <LoadingSkeletonCallList />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 overflow-hidden">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 25) ||
              (meeting as CallRecording)?.filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
