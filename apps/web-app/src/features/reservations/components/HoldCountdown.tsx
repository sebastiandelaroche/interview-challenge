import { useEffect, useState } from "react";
import { Alert } from "antd";
import dayjs from "dayjs";
import { formatDate } from "../../../shared/lib/format";

type Props = {
  expiresAt: string;
  onExpire: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function HoldCountdown({ expiresAt, onExpire }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const remainingMs = dayjs(expiresAt).valueOf() - now;

  useEffect(() => {
    if (remainingMs <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [remainingMs, onExpire]);

  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <Alert
      showIcon
      type={totalSeconds <= 60 ? "warning" : "info"}
      title={`Tickets held for ${pad(minutes)}:${pad(seconds)}`}
      description={`Your hold expires at ${formatDate(expiresAt)}. Confirm before then to secure your tickets.`}
    />
  );
}
