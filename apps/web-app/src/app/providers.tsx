import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { App as AntApp, ConfigProvider } from "antd";
import { store } from "./store";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{ token: { colorPrimary: "#4f46e5", borderRadius: 8 } }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </Provider>
  );
}
