import { Button, Col, Row, Tag, Typography } from "antd";
import { formatMoney } from "../../../shared/lib/format";
import type { TicketTier } from "../types";

type Props = {
  tier: TicketTier;
  onReserve: (tier: TicketTier) => void;
};

export function TierItem({ tier, onReserve }: Props) {
  const soldOut = tier.available <= 0;

  return (
    <Row gutter={16} align="middle" style={{ width: "100%" }}>
      <Col flex="auto">
        <Typography.Text strong>{tier.name}</Typography.Text>
      </Col>
      <Col span={4}>
        <Typography.Text>{formatMoney(tier.price)}</Typography.Text>
      </Col>
      <Col span={5}>
        {soldOut ? (
          <Tag color="red">Sold out</Tag>
        ) : (
          <Typography.Text>{tier.available} left</Typography.Text>
        )}
      </Col>
      <Col span={4} style={{ textAlign: "right" }}>
        <Button
          type="primary"
          disabled={soldOut}
          onClick={() => onReserve(tier)}
        >
          Reserve
        </Button>
      </Col>
    </Row>
  );
}
