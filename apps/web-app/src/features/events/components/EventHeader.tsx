import { Space, Typography } from "antd";
import { formatDate } from "../../../shared/lib/format";
import type { Event } from "../types";

type Props = {
  event: Event;
};

export function EventHeader({ event }: Props) {
  return (
    <Space orientation="vertical" size={4} style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {event.name}
      </Typography.Title>
      <Typography.Text type="secondary">
        {formatDate(event.date)}
      </Typography.Text>
      <Typography.Text>{event.location}</Typography.Text>
      <Typography.Paragraph style={{ marginTop: 12 }}>
        {event.description}
      </Typography.Paragraph>
    </Space>
  );
}
