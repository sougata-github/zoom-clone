import { Call } from "@stream-io/video-react-sdk";
import { useGetUpcomingCalls } from "./useGetCalls";

export const useGetUpcomingMeetingTime = () => {
  const { upcomingCalls, isLoadingUpcomingCalls } = useGetUpcomingCalls();

  const latestUpcomingCall =
    upcomingCalls && upcomingCalls.length > 0
      ? upcomingCalls[upcomingCalls.length - 1]
      : null;

  const startsAt = (latestUpcomingCall as Call)?.state?.startsAt;

  const upcomingMeetingTime = startsAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = new Date();
  const isToday =
    startsAt && startsAt.toLocaleDateString() === today.toLocaleDateString();

  let upcomingMeetingDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(startsAt!);

  if (startsAt) {
    upcomingMeetingDate = isToday ? "Today" : upcomingMeetingDate;
  }

  return {
    latestUpcomingCall,
    upcomingMeetingTime,
    upcomingMeetingDate,
    isLoadingUpcomingCalls,
  };
};
