/**
 * Accessibility (axe) checks for the Watchlist page.
 * Issue: https://github.com/stellar-kracken/swipely_frontend/issues/27
 */
import { render } from "../test/utils";
import { axe } from "vitest-axe";
import { useWatchlistStore } from "../stores/watchlistStore";
import WatchlistPage from "./Watchlist";

// ── Service mocks ─────────────────────────────────────────────────────────────

vi.mock("../services/api", () => ({
  getAssetPrice: vi.fn().mockResolvedValue(null),
  getAssetHealth: vi.fn().mockResolvedValue(null),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Watchlist — accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useWatchlistStore.setState(useWatchlistStore.getInitialState(), true);
  });

  it("has no axe violations when the watchlist is empty", async () => {
    const { container } = render(<WatchlistPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations when the watchlist has assets", async () => {
    useWatchlistStore.getState().addAsset("USDC");
    useWatchlistStore.getState().addAsset("XLM");

    const { container } = render(<WatchlistPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
