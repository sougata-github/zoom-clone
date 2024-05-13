"use client";

import MeetingTypeList from "@/components/MeetingTypeList";

import { useGetUpcomingMeetingTime } from "@/hooks/useGetUpcomingMeetingTime";
import { useGetTodayDateAndTime } from "@/hooks/useGetTodayDateAndTime";

const Page = () => {
  const {
    latestUpcomingCall,
    upcomingMeetingTime,
    upcomingMeetingDate,
    isLoadingUpcomingCalls,
  } = useGetUpcomingMeetingTime();

  const { formattedDate, formattedTime } = useGetTodayDateAndTime();

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover sm:bg-center">
        <div className="flex h-full flex-col justify-between p-10 max-md:px-5 max-md:py-8 lg:p-11">
          {!isLoadingUpcomingCalls ? (
            <div className="glassmorphism max-w-[250px] rounded py-2 px-4 text-left font-normal text-sm">
              <h2 className="font-medium">
                {latestUpcomingCall
                  ? "Upcoming Meeting:"
                  : "No upcoming meeting"}
              </h2>
              <p className="font-semibold italic">
                {latestUpcomingCall &&
                  `
                ${upcomingMeetingDate}
                ${upcomingMeetingTime}`}
              </p>
            </div>
          ) : (
            <div className="w-[250px] h-[60px] animate-pulse transition-all rounded-lg bg-gray-500"></div>
          )}

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {formattedTime}
            </h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Page;
