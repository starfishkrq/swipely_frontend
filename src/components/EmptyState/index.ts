/**
 * EmptyState — public API
 *
 * Single import for all empty-state utilities:
 *
 *   import {
 *     EmptyState,
 *     EmptyIllustration,
 *     EmptyBridges,
 *     EmptyAlerts,
 *     EmptyIncidents,
 *     EmptyTransactions,
 *     EmptySearch,
 *     EmptyConnection,
 *     EmptyWatchlist,
 *     EmptyError,
 *   } from "@/components/EmptyState";
 */

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps, EmptyStateAction } from "./EmptyState";

export * as EmptyIllustration from "./EmptyIllustration";

export {
  EmptyBridges,
  EmptyAlerts,
  EmptyIncidents,
  EmptyTransactions,
  EmptySearch,
  EmptyConnection,
  EmptyWatchlist,
  EmptyError,
} from "./variants";
