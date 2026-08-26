import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  EmptyState,
  EmptyIllustration,
  EmptyBridges,
  EmptyAlerts,
  EmptyIncidents,
  EmptyTransactions,
  EmptySearch,
  EmptyConnection,
  EmptyWatchlist,
  EmptyError,
} from "./index";

// ── Base component ────────────────────────────────────────────────────────────
//
// Prop-documentation gaps noticed:
//   - `ariaLabel` defaults to `title` when omitted (documented inline in
//     source), but this default is not reflected in the TypeScript type
//     (it is typed as `string | undefined`).
//   - `illustration` accepts `ReactNode` — the source exports EmptyIllustration.*
//     helpers but does not document which illustrations exist or what each
//     represents beyond the identifier name.

const meta = {
  title: "Swipely/UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["page", "card", "inline"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof EmptyState>;

// ── Layout variants ───────────────────────────────────────────────────────────

/** Full-page centred state — used for empty route-level views */
export const PageVariant: Story = {
  args: {
    variant: "page",
    illustration: <EmptyIllustration.NoBridges />,
    title: "No bridges yet",
    description:
      "Swipely hasn't detected any bridges. Data is fetched from the Stellar network automatically — check back shortly.",
  },
};

/** Compact state used inside cards and panels */
export const CardVariant: Story = {
  args: {
    variant: "card",
    illustration: <EmptyIllustration.NoAlerts />,
    title: "No active alerts",
    description:
      "Everything is healthy. Alerts will appear here when thresholds are breached.",
  },
};

/** Minimal single-line state for use inside tables or lists */
export const InlineVariant: Story = {
  args: {
    variant: "inline",
    title: "No results",
    description: "Try adjusting your filters.",
  },
};

// ── With actions ──────────────────────────────────────────────────────────────

/** Page variant with a single primary action */
export const WithPrimaryAction: Story = {
  args: {
    variant: "page",
    illustration: <EmptyIllustration.NoResults />,
    title: "No bridges match your filters",
    description:
      "Try adjusting your search or filter criteria to find what you're looking for.",
    actions: [{ label: "Clear filters", onClick: action("clear-filters"), variant: "primary" }],
  },
};

/** Card variant with both primary and secondary actions */
export const WithTwoActions: Story = {
  args: {
    variant: "card",
    illustration: <EmptyIllustration.NoWatchlist />,
    title: "Your watchlist is empty",
    description:
      "Star bridges you want to track closely. They'll show up here for quick access.",
    actions: [
      { label: "Browse bridges", href: "/bridges", variant: "primary" },
      { label: "Learn more", onClick: action("learn-more"), variant: "secondary" },
    ],
  },
};

/** Card variant with no illustration */
export const NoIllustration: Story = {
  args: {
    variant: "card",
    title: "Nothing here yet",
    description: "Data will appear here once it becomes available.",
    actions: [{ label: "Refresh", onClick: action("refresh") }],
  },
};

// ── Pre-built variants ────────────────────────────────────────────────────────

export const EmptyBridgesDefault: Story = {
  name: "EmptyBridges — no data",
  render: () => <EmptyBridges />,
};

export const EmptyBridgesWithFilters: Story = {
  name: "EmptyBridges — filters active",
  render: () => (
    <EmptyBridges hasFilters onClearFilters={action("clear-filters")} />
  ),
};

export const EmptyAlertsDefault: Story = {
  name: "EmptyAlerts — no data",
  render: () => <EmptyAlerts />,
};

export const EmptyAlertsWithFilters: Story = {
  name: "EmptyAlerts — filters active",
  render: () => (
    <EmptyAlerts hasFilters onClearFilters={action("clear-filters")} />
  ),
};

export const EmptyIncidentsDefault: Story = {
  name: "EmptyIncidents",
  render: () => <EmptyIncidents />,
};

export const EmptyTransactionsDefault: Story = {
  name: "EmptyTransactions — generic",
  render: () => <EmptyTransactions />,
};

export const EmptyTransactionsWithFilters: Story = {
  name: "EmptyTransactions — filters active",
  render: () => (
    <EmptyTransactions hasFilters onClearFilters={action("clear-filters")} />
  ),
};

export const EmptySearchNoQuery: Story = {
  name: "EmptySearch — no query",
  render: () => <EmptySearch onClear={action("clear-search")} />,
};

export const EmptySearchWithQuery: Story = {
  name: "EmptySearch — with query",
  render: () => (
    <EmptySearch query="xlm-usdc-circle" onClear={action("clear-search")} />
  ),
};

export const EmptyConnectionDefault: Story = {
  name: "EmptyConnection",
  render: () => <EmptyConnection onRetry={action("retry")} />,
};

export const EmptyWatchlistDefault: Story = {
  name: "EmptyWatchlist",
  render: () => (
    <EmptyWatchlist onBrowseBridges={action("browse-bridges")} />
  ),
};

export const EmptyErrorDefault: Story = {
  name: "EmptyError — generic",
  render: () => <EmptyError onRetry={action("retry")} />,
};

export const EmptyErrorCustomMessage: Story = {
  name: "EmptyError — custom message",
  render: () => (
    <EmptyError
      message="The Stellar network returned an unexpected response."
      onRetry={action("retry")}
    />
  ),
};
