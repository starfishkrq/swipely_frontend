import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "../i18n/config";
import { useWatchlistStore } from "../stores/watchlistStore";
import WatchlistPage from "./Watchlist";

function renderWatchlistPage() {
  return render(
    <MemoryRouter>
      <Suspense fallback={null}>
        <WatchlistPage />
      </Suspense>
    </MemoryRouter>,
  );
}

describe("WatchlistPage", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    useWatchlistStore.setState(useWatchlistStore.getInitialState(), true);
    await i18n.changeLanguage("en");
  });

  it("shows a friendly empty state when the active watchlist has no assets", async () => {
    renderWatchlistPage();

    expect(await screen.findByText("Your watchlist is empty")).toBeInTheDocument();
    expect(
      screen.getByText("Star bridges you want to track closely. They'll show up here for quick access."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse bridges" })).toHaveAttribute("href", "/bridges");
  });

  it("does not render the empty state once assets are added to the watchlist", async () => {
    useWatchlistStore.getState().addAsset("USDC");

    renderWatchlistPage();

    expect(await screen.findByText("USDC")).toBeInTheDocument();
    expect(screen.queryByText("Your watchlist is empty")).not.toBeInTheDocument();
  });
});
