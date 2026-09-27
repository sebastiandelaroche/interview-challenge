import { useState } from "react";
import { Space } from "antd";
import { useParams } from "react-router";
import { PageState } from "../../../shared/ui/PageState";
import { getErrorMessage } from "../../../shared/api/errors";
import { ReserveModal } from "../../reservations/components/ReserveModal";
import { useGetEventQuery } from "../api";
import { EventHeader } from "../components/EventHeader";
import { TierList } from "../components/TierList";

export function EventDetailPage() {
  const { id = "" } = useParams();
  const { data: event, isLoading, error, refetch } = useGetEventQuery(id);
  const [selectedTierId, setSelectedTierId] = useState<string>();

  // Derive from fresh data so availability updates after a refetch (e.g. on 409)
  const selectedTier = event?.tiers.find((tier) => tier.id === selectedTierId);

  return (
    <PageState
      isLoading={isLoading}
      error={error ? getErrorMessage(error) : undefined}
    >
      {event && (
        <Space orientation="vertical" size={24} style={{ width: "100%" }}>
          <EventHeader event={event} />
          <TierList
            tiers={event.tiers}
            onReserve={(tier) => setSelectedTierId(tier.id)}
          />
        </Space>
      )}
      {event && selectedTier && (
        <ReserveModal
          key={selectedTier.id}
          eventId={event.id}
          tier={selectedTier}
          onClose={() => setSelectedTierId(undefined)}
          onConflict={refetch}
        />
      )}
    </PageState>
  );
}
