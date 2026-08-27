/**
 * Accessibility (axe) checks for the Dashboard page.
 * Issue: https://github.com/stellar-kracken/swipely_frontend/issues/27
 */
import { render } from "../test/utils";
import { axe } from "vitest-axe";
import Dashboard from "./Dashboard";

// ── Hook mocks ────────────────────────────────────────────────────────────────

vi.mock("../hooks/useAssets", () => ({
  useAssetsWithHealth: () => ({
    data: [
      {
        symbol: "USDC",
        name: "USD Coin",
        health: {
          symbol: "USDC",
          overallScore: 88,
          trend: "stable",
          factors: {
            liquidityDepth: 90,
            priceStability: 85,
            bridgeUptime: 100,
            reserveBacking: 88,
            volumeTrend: 80,
          },
          lastUpdated: new Date().toISOString(),
        },
      },
      {
        symbol: "XLM",
        name: "Stellar Lumens",
        health: {
          symbol: "XLM",
          overallScore: 73,
          trend: "improving",
          factors: {
            liquidityDepth: 70,
            priceStability: 75,
            bridgeUptime: 90,
            reserveBacking: 70,
            volumeTrend: 60,
          },
          lastUpdated: new Date().toISOString(),
        },
      },
    ],
    isLoading: false,
    isFetching: false,
    dataUpdatedAt: Date.now(),
    refetch: vi.fn(),
  }),
}));

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
    isFetching: false,
    dataUpdatedAt: Date.now(),
    refetch: vi.fn(),
  }),
}));

vi.mock("../hooks/useDashboardFilters", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("../hooks/useDashboardFilters")>();
  return {
    ...original,
    useDashboardFilters: () => ({
      filters: original.DEFAULT_DASHBOARD_FILTERS,
      savedPresets: [],
      hasActiveFilters: false,
      toggleAsset: vi.fn(),
      toggleBridge: vi.fn(),
      setStatus: vi.fn(),
      setTimeRange: vi.fn(),
      clearAll: vi.fn(),
      savePreset: vi.fn(),
      applyPreset: vi.fn(),
      renamePreset: vi.fn(),
      setPresetShared: vi.fn(),
      deletePreset: vi.fn(),
    }),
  };
});

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

vi.mock("../hooks/usePullToRefresh", () => ({
  usePullToRefresh: () => ({
    isPulling: false,
    pullDistance: 0,
    progress: 0,
    isRefreshing: false,
    refresh: vi.fn(),
  }),
}));

vi.mock("../hooks/useDashboardTour", () => ({
  useDashboardTour: () => ({
    activeStep: -1,
    completed: false,
    start: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    skip: vi.fn(),
    finish: vi.fn(),
  }),
}));

vi.mock("../components/analytics/ComparativeSparklineGrid", () => ({
  default: () => <div data-testid="sparkline-grid" />,
}));

vi.mock("../components/watchlist/WatchlistWidget", () => ({
  default: () => <div data-testid="watchlist-widget" />,
}));

vi.mock("../components/dashboard/ExternalDependencyPanel", () => ({
  default: () => <div data-testid="external-dependency-panel" />,
}));

vi.mock("../components/timeline", () => ({
  RecentActivityTimeline: () => <div data-testid="activity-timeline" />,
}));

vi.mock("../components/dashboard/DashboardTour", () => ({
  default: () => null,
}));

vi.mock("../components/dashboard/InlineStatusCards", () => ({
  default: () => <div data-testid="inline-status-cards" />,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Dashboard — accessibility", () => {
  it("has no axe violations on initial render", async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15_000);
});
