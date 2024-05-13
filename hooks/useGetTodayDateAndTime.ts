import { useEffect, useState } from "react";

export const useGetTodayDateAndTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(currentDateTime);

  return { formattedDate, formattedTime };
};
