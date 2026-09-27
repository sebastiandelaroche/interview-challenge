import { Card, Empty, Listy } from "antd";
import type { TicketTier } from "../types";
import { TierItem } from "./TierItem";

type Props = {
  tiers: TicketTier[];
  onReserve: (tier: TicketTier) => void;
};

export function TierList({ tiers, onReserve }: Props) {
  return (
    <Card title="Tickets">
      {tiers.length === 0 ? (
        <Empty description="No ticket tiers available" />
      ) : (
        <Listy
          items={tiers}
          rowKey="id"
          virtual={false}
          itemRender={(tier) => <TierItem tier={tier} onReserve={onReserve} />}
        />
      )}
    </Card>
  );
}
