"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { redirect, useRouter } from "next/navigation";

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

import ReactDatePicker from "react-datepicker";
import { extractPath } from "@/lib/utils";

const MeetingTypeList = () => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const client = useStreamVideoClient();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time!",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant meeting";

      if (
        new Date(values.dateTime) < new Date(Date.now() - 1000 * 60) &&
        meetingState === "isScheduleMeeting"
      ) {
        toast({
          title: "Cannot schedule a meeting in the past!",
        });
        return;
      }

      if (!values.description && meetingState === "isScheduleMeeting") {
        toast({
          title: "Please provide a meeting description!",
        });
        return;
      }

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (meetingState === "isInstantMeeting") {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting created!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting!",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        background="bg-orange-1"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        background="bg-blue-1"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        background="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        background="bg-yellow-1"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          className="text-center"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
            <div className="flex w-full flex-col gap-2.5">
              <label>Select Date and Time</label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="cursor-pointer w-full rounded bg-dark-2 p-2 focus:outline-none"
              />
            </div>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => {
            setMeetingState(undefined);
          }}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => {
          setMeetingState(undefined);
        }}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(extractPath(values.link!))}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
