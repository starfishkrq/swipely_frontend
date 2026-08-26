import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18n from "../../i18n/config";
import { EmptyBridges, EmptyAlerts, EmptyIncidents, EmptyTransactions, EmptyWatchlist } from "./variants";

function renderVariant(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <Suspense fallback={null}>{ui}</Suspense>
    </MemoryRouter>,
  );
}

describe("EmptyState variants", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("EmptyBridges shows the no-data message with no clear action by default", async () => {
    renderVariant(<EmptyBridges />);

    expect(await screen.findByText("No bridges yet")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
  });

  it("EmptyBridges shows the filtered message and a clear-filters action when hasFilters is set", async () => {
    const onClearFilters = vi.fn();
    renderVariant(<EmptyBridges hasFilters onClearFilters={onClearFilters} />);

    expect(await screen.findByText("No bridges match your filters")).toBeInTheDocument();
    screen.getByRole("button", { name: "Clear filters" }).click();
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("EmptyAlerts distinguishes no data from no matches", async () => {
    renderVariant(<EmptyAlerts />);
    expect(await screen.findByText("No active alerts")).toBeInTheDocument();

    renderVariant(<EmptyAlerts hasFilters onClearFilters={() => {}} />);
    expect(await screen.findByText("No alerts match your filters")).toBeInTheDocument();
  });

  it("EmptyIncidents renders a friendly message", async () => {
    renderVariant(<EmptyIncidents />);
    expect(await screen.findByText("No incidents recorded")).toBeInTheDocument();
  });

  it("EmptyTransactions distinguishes no data from no matches", async () => {
    renderVariant(<EmptyTransactions />);
    expect(await screen.findByText("No transactions found")).toBeInTheDocument();

    renderVariant(<EmptyTransactions hasFilters onClearFilters={() => {}} />);
    expect(await screen.findByText("No transactions match your filters")).toBeInTheDocument();
  });

  it("EmptyWatchlist links to the bridges page", async () => {
    renderVariant(<EmptyWatchlist onBrowseBridges={() => {}} />);

    expect(await screen.findByText("Your watchlist is empty")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse bridges" })).toHaveAttribute("href", "/bridges");
  });
});
