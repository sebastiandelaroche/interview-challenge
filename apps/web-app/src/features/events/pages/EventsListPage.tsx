import { Col, Row, Typography } from "antd";
import { PageState } from "../../../shared/ui/PageState";
import { getErrorMessage } from "../../../shared/api/errors";
import { useGetEventsQuery } from "../api";
import { EventCard } from "../components/EventCard";

export function EventsListPage() {
  const { data: events = [], isLoading, error } = useGetEventsQuery();

  return (
    <>
      <Typography.Title level={2}>Events</Typography.Title>
      <PageState
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : undefined}
        isEmpty={events.length === 0}
        emptyText="No events yet"
      >
        <Row gutter={[16, 16]}>
          {events.map((event) => (
            <Col key={event.id} xs={24} sm={12} lg={8}>
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      </PageState>
    </>
  );
}
