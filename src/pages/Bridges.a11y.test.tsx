/**
 * Accessibility (axe) checks for the Bridges page.
 * Issue: https://github.com/stellar-kracken/swipely_frontend/issues/27
 */
import { render } from "../test/utils";
import { axe } from "vitest-axe";
import Bridges from "./Bridges";

// ── Hook mocks ────────────────────────────────────────────────────────────────

vi.mock("../hooks/useBridges", () => ({
  useBridges: () => ({
    data: {
      bridges: [
        {
          name: "Circle",
          status: "healthy",
          totalValueLocked: 500_000_000,
          supplyOnStellar: 500_000_000,
          supplyOnSource: 500_000_000,
          mismatchPercentage: 0,
        },
        {
          name: "Wormhole",
          status: "degraded",
          totalValueLocked: 200_000_000,
          supplyOnStellar: 190_000_000,
          supplyOnSource: 200_000_000,
          mismatchPercentage: 5.0,
        },
      ],
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("../hooks/useFavorites", () => ({
  useFavorites: () => ({
    favoritesFilterMode: "all",
    setFavoritesFilterMode: vi.fn(),
    toggleFavoriteBridge: vi.fn(),
    toggleFavoriteAsset: vi.fn(),
    favoriteBridges: [],
    favoriteAssets: [],
  }),
}));

vi.mock("../hooks/useRefreshControls", () => ({
  useRefreshControls: () => ({
    preferences: {
      autoRefreshEnabled: false,
      refreshIntervalMs: 30_000,
      refreshOnFocus: false,
      selectedTargetIds: [],
    },
    isRefreshing: false,
    lastUpdatedAt: null,
    setAutoRefreshEnabled: vi.fn(),
    setRefreshIntervalMs: vi.fn(),
    setRefreshOnFocus: vi.fn(),
    setSelectedTargetIds: vi.fn(),
    refreshNow: vi.fn(),
    cancelRefresh: vi.fn(),
  }),
}));

vi.mock("../hooks/usePullToRefresh", () => ({
  usePullToRefresh: () => ({
    isPulling: false,
    pullDistance: 0,
    progress: 0,
    isRefreshing: false,
    refresh: vi.fn(),
  }),
}));

vi.mock("../stores/bridgeFilterSortStore", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("../stores/bridgeFilterSortStore")>();
  return {
    ...original,
    useBridgeFilterSortStore: (selector: (s: import("../stores/bridgeFilterSortStore").BridgeFilterSortStore) => unknown) => {
      const state: import("../stores/bridgeFilterSortStore").BridgeFilterSortStore = {
        statusFilter: "all",
        sortBy: "name",
        setStatusFilter: vi.fn(),
        setSortBy: vi.fn(),
        reset: vi.fn(),
      };
      return selector(state);
    },
  };
});

vi.mock("../components/BridgeFilterSort", () => ({
  default: () => <div data-testid="bridge-filter-sort" />,
}));

vi.mock("../components/BridgeNotesPanel", () => ({
  default: () => null,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Bridges — accessibility", () => {
  it("has no axe violations on initial render", async () => {
    const { container } = render(<Bridges />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
