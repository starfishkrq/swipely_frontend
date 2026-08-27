/**
 * Accessibility (axe) checks for the Alerts page.
 * Issue: https://github.com/stellar-kracken/swipely_frontend/issues/27
 */
import { render } from "../test/utils";
import { axe } from "vitest-axe";
import Alerts from "./Alerts";

// ── Hook mocks ────────────────────────────────────────────────────────────────

const mockUseIncidentFeed = vi.fn();

vi.mock("../hooks/useIncidentFeed", () => ({
  useIncidentFeed: (...args: unknown[]) => mockUseIncidentFeed(...args),
}));

const populatedReturn = {
  incidents: [
    {
      id: "inc-1",
      bridgeId: "Circle",
      assetCode: "USDC",
      severity: "high" as const,
      status: "open" as const,
      title: "Supply mismatch detected on Circle/USDC",
      description: "Mismatch exceeds threshold.",
      sourceUrl: null,
      sourceType: null,
      sourceExternalId: null,
      sourceRepository: null,
      sourceRepoAvatarUrl: null,
      sourceActor: null,
      sourceAttribution: {},
      requiresManualReview: false,
      ingestionAttemptCount: 1,
      lastIngestionError: null,
      normalizedFingerprint: null,
      followUpActions: [],
      occurredAt: new Date().toISOString(),
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inc-2",
      bridgeId: "Wormhole",
      assetCode: null,
      severity: "low" as const,
      status: "resolved" as const,
      title: "Brief latency spike on Wormhole",
      description: "Latency returned to normal.",
      sourceUrl: null,
      sourceType: null,
      sourceExternalId: null,
      sourceRepository: null,
      sourceRepoAvatarUrl: null,
      sourceActor: null,
      sourceAttribution: {},
      requiresManualReview: false,
      ingestionAttemptCount: 1,
      lastIngestionError: null,
      normalizedFingerprint: null,
      followUpActions: [],
      occurredAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  total: 2,
  unreadCount: 1,
  isLoading: false,
  error: null,
  readIds: new Set<string>(),
  markRead: vi.fn(),
  refetch: vi.fn(),
};

const loadingReturn = {
  incidents: [],
  total: 0,
  unreadCount: 0,
  isLoading: true,
  error: null,
  readIds: new Set<string>(),
  markRead: vi.fn(),
  refetch: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Alerts — accessibility", () => {
  it("has no axe violations with a populated alert list", async () => {
    mockUseIncidentFeed.mockReturnValue(populatedReturn);
    const { container } = render(<Alerts />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in the loading state", async () => {
    mockUseIncidentFeed.mockReturnValue(loadingReturn);
    const { container } = render(<Alerts />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
