"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { avatarImages } from "@/constants";

import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string | Date;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  const time = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const meetingDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg sm:text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">
              {meetingDate} <span className="font-bold">{time}</span>
            </p>
          </div>
        </div>
      </article>
      <article
        className={cn(
          "lg:mt-0 mt-4 flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center lg:justify-center relative",
          {}
        )}
      >
        <div className="flex w-full">
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn("rounded-full", { absolute: index > 0 })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
        </div>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button
              onClick={handleClick}
              className="rounded bg-blue-1 hover:bg-blue-1 sm:text-base text-sm text-center"
            >
              {buttonIcon1 && (
                <Image
                  src={buttonIcon1}
                  alt="feature"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              )}
              {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
