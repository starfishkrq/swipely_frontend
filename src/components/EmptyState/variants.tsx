/**
 * EmptyState Variants
 *
 * Ready-to-use compositions of EmptyState + EmptyIllustration for each
 * Swipely view. Import the variant that matches the page rather than
 * constructing props from scratch — this keeps copy and illustrations
 * consistent across the app. Copy is routed through react-i18next.
 *
 * Usage:
 *   import { EmptyBridges, EmptyAlerts } from "@/components/EmptyState";
 *
 *   // In a component:
 *   if (bridges.length === 0) return <EmptyBridges onAddBridge={openModal} />;
 */

import { useTranslation } from "react-i18next";
import { EmptyState } from "./EmptyState";
import * as EmptyIllustration from "./EmptyIllustration";

// ── No bridges ────────────────────────────────────────────────────────────────

interface EmptyBridgesProps {
  /** Whether any filters are active — changes copy and actions. */
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyBridges({ hasFilters, onClearFilters }: EmptyBridgesProps) {
  const { t } = useTranslation();

  if (hasFilters) {
    return (
      <EmptyState
        variant="page"
        illustration={<EmptyIllustration.NoResults />}
        title={t("emptyStates.bridges.filteredTitle")}
        description={t("emptyStates.bridges.filteredDescription")}
        actions={[
          { label: t("common.clearFilters"), onClick: onClearFilters, variant: "primary" },
        ]}
        ariaLabel={t("emptyStates.bridges.filteredTitle")}
      />
    );
  }

  return (
    <EmptyState
      variant="page"
      illustration={<EmptyIllustration.NoBridges />}
      title={t("emptyStates.bridges.title")}
      description={t("emptyStates.bridges.description")}
      ariaLabel={t("emptyStates.bridges.title")}
    />
  );
}

// ── No alerts ─────────────────────────────────────────────────────────────────

interface EmptyAlertsProps {
  /** Whether any filters or search are active — changes copy and actions. */
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyAlerts({ hasFilters, onClearFilters }: EmptyAlertsProps) {
  const { t } = useTranslation();

  if (hasFilters) {
    return (
      <EmptyState
        variant="card"
        illustration={<EmptyIllustration.NoResults />}
        title={t("emptyStates.alerts.filteredTitle")}
        description={t("emptyStates.alerts.filteredDescription")}
        actions={[
          { label: t("common.clearFilters"), onClick: onClearFilters, variant: "primary" },
        ]}
        ariaLabel={t("emptyStates.alerts.filteredTitle")}
      />
    );
  }

  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.NoAlerts />}
      title={t("emptyStates.alerts.title")}
      description={t("emptyStates.alerts.description")}
      ariaLabel={t("emptyStates.alerts.title")}
    />
  );
}

// ── No incidents ──────────────────────────────────────────────────────────────

export function EmptyIncidents() {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.NoAlerts />}
      title={t("emptyStates.incidents.title")}
      description={t("emptyStates.incidents.description")}
      ariaLabel={t("emptyStates.incidents.title")}
    />
  );
}

// ── No transactions ───────────────────────────────────────────────────────────

interface EmptyTransactionsProps {
  /** Whether any filters are active — changes copy and actions. */
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyTransactions({ hasFilters, onClearFilters }: EmptyTransactionsProps) {
  const { t } = useTranslation();

  if (hasFilters) {
    return (
      <EmptyState
        variant="card"
        illustration={<EmptyIllustration.NoResults />}
        title={t("emptyStates.transactions.filteredTitle")}
        description={t("emptyStates.transactions.filteredDescription")}
        actions={[
          { label: t("common.clearFilters"), onClick: onClearFilters, variant: "primary" },
        ]}
        ariaLabel={t("emptyStates.transactions.filteredTitle")}
      />
    );
  }

  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.NoTransactions />}
      title={t("emptyStates.transactions.title")}
      description={t("emptyStates.transactions.description")}
      ariaLabel={t("emptyStates.transactions.title")}
    />
  );
}

// ── No search results ─────────────────────────────────────────────────────────

interface EmptySearchProps {
  query?: string;
  onClear?: () => void;
}

export function EmptySearch({ query, onClear }: EmptySearchProps) {
  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.NoResults />}
      title="No results found"
      description={
        query
          ? `No matches for "${query}". Try a different search term.`
          : "No matches found. Try a different search term."
      }
      actions={onClear ? [{ label: "Clear search", onClick: onClear, variant: "secondary" }] : []}
      ariaLabel={query ? `No results for ${query}` : "No search results"}
    />
  );
}

// ── Connection error ──────────────────────────────────────────────────────────

interface EmptyConnectionProps {
  onRetry?: () => void;
}

export function EmptyConnection({ onRetry }: EmptyConnectionProps) {
  return (
    <EmptyState
      variant="page"
      illustration={<EmptyIllustration.Disconnected />}
      title="Unable to connect"
      description="Swipely can't reach the Stellar network right now. Check your connection and try again."
      actions={onRetry ? [{ label: "Retry", onClick: onRetry, variant: "primary" }] : []}
      ariaLabel="Connection error"
    />
  );
}

// ── No watchlist items ────────────────────────────────────────────────────────

interface EmptyWatchlistProps {
  onBrowseBridges?: () => void;
}

export function EmptyWatchlist({ onBrowseBridges }: EmptyWatchlistProps) {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.NoWatchlist />}
      title={t("emptyStates.watchlist.title")}
      description={t("emptyStates.watchlist.description")}
      actions={
        onBrowseBridges
          ? [
              {
                label: t("emptyStates.watchlist.browseBridges"),
                onClick: onBrowseBridges,
                href: "/bridges",
                variant: "primary",
              },
            ]
          : []
      }
      ariaLabel={t("emptyStates.watchlist.title")}
    />
  );
}

// ── Generic data loading error ────────────────────────────────────────────────

interface EmptyErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function EmptyError({ message, onRetry }: EmptyErrorProps) {
  return (
    <EmptyState
      variant="card"
      illustration={<EmptyIllustration.Disconnected />}
      title="Something went wrong"
      description={message ?? "An unexpected error occurred while loading data. Please try again."}
      actions={onRetry ? [{ label: "Try again", onClick: onRetry, variant: "primary" }] : []}
      ariaLabel="Error loading data"
    />
  );
}
