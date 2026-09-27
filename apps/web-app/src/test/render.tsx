import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router";
import { makeStore } from "../app/store";
import { routes } from "../app/router";

export function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <Provider store={makeStore()}>
      <RouterProvider router={router} />
    </Provider>,
  );
}

export function renderWithProviders(ui: ReactElement) {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
}
