import { useCallback, useState } from "react";
import { Alert, Button, Popconfirm, Result, Space, Typography } from "antd";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";
import { PageState } from "../../../shared/ui/PageState";
import { getErrorMessage, isGone } from "../../../shared/api/errors";
import {
  useCancelReservationMutation,
  useConfirmReservationMutation,
  useGetReservationQuery,
} from "../api";
import { HoldCountdown } from "../components/HoldCountdown";
import { OrderResult } from "../components/OrderResult";
import { ReservationSummary } from "../components/ReservationSummary";

export function ReservationPage() {
  const { id = "" } = useParams();
  const { data: reservation, isLoading, error } = useGetReservationQuery(id);
  const [confirm, confirmState] = useConfirmReservationMutation();
  const [cancel, cancelState] = useCancelReservationMutation();

  // The server only flips on-hold → expired on its sweep, so track the
  // client-side deadline too to lock the UI the moment the hold lapses.
  const [holdLapsed, setHoldLapsed] = useState(false);
  const markLapsed = useCallback(() => setHoldLapsed(true), []);

  const actionError = confirmState.error ?? cancelState.error;
  const isBusy = confirmState.isLoading || cancelState.isLoading;

  if (confirmState.data) return <OrderResult order={confirmState.data} />;

  const expired =
    !!reservation &&
    (reservation.status === "expired" ||
      isGone(actionError) ||
      (reservation.status === "on-hold" &&
        (holdLapsed || dayjs().isAfter(reservation.expiresAt))));
  const status = expired ? "expired" : reservation?.status;

  return (
    <PageState
      isLoading={isLoading}
      error={error ? getErrorMessage(error) : undefined}
    >
      {reservation && status && (
        <Space orientation="vertical" size={24} style={{ width: "100%" }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Your reservation
          </Typography.Title>

          {expired && (
            <Result
              status="warning"
              title="Your hold has expired"
              subTitle="The tickets were released. You can start a new reservation from the event page."
              extra={
                <Link to={`/events/${reservation.event.id}`}>
                  <Button type="primary">
                    Back to {reservation.event.name}
                  </Button>
                </Link>
              }
            />
          )}

          {status === "on-hold" && (
            <HoldCountdown
              expiresAt={reservation.expiresAt}
              onExpire={markLapsed}
            />
          )}

          {status === "cancelled" && (
            <Alert
              showIcon
              type="info"
              title="This reservation was cancelled"
              action={
                <Link to={`/events/${reservation.event.id}`}>
                  <Button size="small">Back to event</Button>
                </Link>
              }
            />
          )}

          {status === "confirmed" && (
            <Alert
              showIcon
              type="success"
              title="This reservation is confirmed"
            />
          )}

          {actionError && !expired && (
            <Alert showIcon type="error" title={getErrorMessage(actionError)} />
          )}

          <ReservationSummary reservation={reservation} status={status} />

          {status === "on-hold" && (
            <Space>
              <Button
                type="primary"
                size="large"
                loading={confirmState.isLoading}
                disabled={isBusy}
                onClick={() => {
                  cancelState.reset();
                  confirm(reservation.id);
                }}
              >
                Confirm Order
              </Button>
              <Popconfirm
                title="Cancel this reservation?"
                description="Your held tickets will be released."
                okText="Yes, cancel"
                cancelText="Keep it"
                onConfirm={() => {
                  confirmState.reset();
                  cancel(reservation.id);
                }}
              >
                <Button
                  danger
                  size="large"
                  loading={cancelState.isLoading}
                  disabled={isBusy}
                >
                  Cancel
                </Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      )}
    </PageState>
  );
}
