import type { ReactNode } from "react";
import { Empty, Result, Spin } from "antd";

type Props = {
  isLoading: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyText?: string;
  children: ReactNode;
};

export function PageState({
  isLoading,
  error,
  isEmpty,
  emptyText,
  children,
}: Props) {
  if (isLoading)
    return (
      <Spin size="large" style={{ display: "block", margin: "64px auto" }} />
    );
  if (error)
    return (
      <Result status="error" title="Could not load data" subTitle={error} />
    );
  if (isEmpty)
    return <Empty description={emptyText} style={{ marginTop: 64 }} />;
  return <>{children}</>;
}
