# Zorvyn

> A production-grade personal finance dashboard built with React, Zustand, GSAP, and Recharts. Tracks income, expenses, and savings with animated charts, role-based access, persistent state, and a fully responsive layout across all screen sizes.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)](https://zustand-demo.pmnd.rs)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)](https://greensock.com/gsap)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22b5bf)](https://recharts.org)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

---

## Features

### Dashboard
- **Animated stat cards** — Total Balance, Monthly Income, Monthly Expenses, each with a GSAP-powered number counter that animates to its value on load and re-animates when the underlying data changes
- **Percentage change badges** — dynamically calculated by comparing the current month's transactions against the previous month, with directional arrows and colour-coded badges (green for improvement, red for regression)
- **Revenue Overview chart** — 12-month area chart showing income vs expenses using hardcoded monthly summary data, with custom-styled tooltips and smooth entrance animations
- **Spending Breakdown chart** — bar chart showing the top 6 expense categories ranked by total spend, colour-coded per category
- **Recent Transactions list** — last 8 transactions displayed in a compact, scrollable list directly on the dashboard
- **Insights Panel** — five live metrics calculated from the real transaction dataset: Savings Rate, Top Spending Category, Average Transaction, Monthly Change (vs prior month), and Net Balance

### Transactions
- **Full transaction table** — scrollable list of all transactions with category emoji, description, formatted date, category badge, amount (colour-coded by type), and a delete button
- **Debounced search** — 280ms debounce matching on both description and category fields
- **Multi-filter system** — type filter (Income / Expense / All), category dropdown, and sort order (Newest First / Highest Amount) — all filters applied simultaneously via `useMemo`
- **Add Transaction modal** — form with description, amount, date, category select, and Income/Expense type toggle; includes inline validation, disabled submit state, and GSAP scale + fade animation
- **Delete with animation** — each row animates to zero height before being removed from the store, so there's no visual jump

### Analytics
- **Monthly Income vs Expenses bar chart** — full-width, rendered against the 12-month static summary data
- **Spending by Category horizontal bar chart** — reactive to real transaction data, showing all categories with their associated colours
- **Monthly Savings Trend line chart** — derived from actual transaction records, grouped by calendar month
- **Summary stat boxes** — Best Month, Worst Month, and Average Monthly Savings, all calculated dynamically

### Wallet
- **Total Balance display** — animated counter showing the net balance across all transactions
- **Income vs Expense ratio bar** — a progress bar showing the proportion of income to total cashflow, with percentage labels on each end
- **Quick stats** — Net Savings and Savings Rate in a two-column grid
- **Connected Accounts (Coming Soon)** — fully styled placeholder cards for Bank Account, Credit Card, and UPI/Wallet with a "Coming Soon" badge — not a blank placeholder

### Role-Based Access
- **Admin role** — sees the Add Transaction button in the header, delete buttons on every transaction row, and can open the Add Transaction modal
- **Viewer role** — read-only access; the Add button and all delete buttons are hidden, the modal gate prevents access even if triggered programmatically
- **Role switcher** — available in the sidebar and mobile drawer, switches immediately with no page reload required

### Theme
- **Dark mode (default)** — deep navy background with teal and indigo accents
- **Light mode** — clean white/grey surfaces with the same accent palette
- **Anti-flash persistence** — theme preference is stored in Zustand's `persist` middleware and applied to `<html>` synchronously via an inline script in `index.html` before the first paint, eliminating the flash of wrong theme on refresh

### Export
- **CSV export** — generates a properly formatted CSV with a header row; expense amounts are prefixed with a minus sign for spreadsheet compatibility
- **JSON export** — pretty-printed with metadata (export timestamp, transaction count) alongside the full transaction array
- Both formats trigger a real browser file download via `URL.createObjectURL`

### Persistence
- Transactions, theme preference, and role are persisted to `localStorage` via Zustand's `persist` middleware
- Filter state, loading state, and toasts are explicitly excluded from persistence — they reset on every session

### Loading States
- **Skeleton loaders** — three skeleton stat cards and two skeleton chart placeholders shown during the 1.4-second mock API load; dimensions match real card dimensions exactly to prevent layout shift
- **Empty states** — distinct states for "no transactions yet", "no search results", and "analytics with no data" — each with an emoji, heading, subtext, and contextual action button

### Animations
- GSAP stagger on page load (stat cards, chart cards)
- GSAP page transitions on navigation
- GSAP hover micro-interactions on stat cards (y: -4px lift), sidebar items (x: 3px nudge), and buttons
- GSAP modal open/close (scale + fade)
- GSAP toast enter-from-right and fade-out-on-dismiss
- GSAP row delete (height collapse before removal)
- GSAP transaction row stagger when filter results change

---

## Tech Stack

| Technology | Version | Why chosen |
|---|---|---|
| **React** | 18.3 | Functional components and hooks give the right granularity of reactivity without the overhead of a framework |
| **Vite** | 5.3 | Near-instant HMR and a lean build pipeline — far faster than CRA for a project of this size |
| **Tailwind CSS** | 3.4 | Utility-first approach eliminates style collision and keeps components self-contained; `darkMode: 'class'` integrates cleanly with the CSS variable theme system |
| **Zustand** | 4.5 | Selector-based subscriptions mean components only re-render for the exact slice of state they use; no Provider boilerplate; `persist` middleware adds persistence in one line |
| **GSAP** | 3.12 | Imperative control over animation sequences, `onComplete` callbacks for clean unmount, and `gsap.to({ value })` for the animated number counter — things Framer Motion and CSS cannot do as cleanly |
| **Recharts** | 2.12 | Composable chart primitives (`AreaChart`, `BarChart`, `LineChart`) with `ResponsiveContainer` for zero-config responsive widths; built-in `animationDuration` prop per chart |
| **Lucide React** | 0.383 | Consistent 24px icon set, tree-shakeable, and visually cohesive with the minimal design system |
| **Sora + JetBrains Mono** | — | Sora gives the UI a fintech-adjacent feel without looking like every other dashboard. JetBrains Mono is used exclusively for all financial numbers — monospace spacing makes amounts scannable in a list |

---

## Project Structure

```
Zorvyn/
├── index.html                      # Entry HTML — includes anti-flash theme script
├── vite.config.js
├── tailwind.config.js              # Design tokens backed by CSS custom properties
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                    # React root mount
    ├── index.css                   # CSS variables, light mode overrides, base resets
    ├── App.jsx                     # Root layout, page router, modal gate, theme sync
    │
    ├── data/
    │   └── mockData.js             # Seed transactions, category metadata, monthly summaries
    │
    ├── store/
    │   └── useStore.js             # Zustand store — all global state and actions
    │
    ├── hooks/
    │   ├── useDebounce.js          # Delays value updates — used for search input
    │   ├── useLocalStorage.js      # Read/write localStorage with JSON serialization
    │   ├── useAnimatedCounter.js   # GSAP-powered number tween returning animated value
    │   └── useMockApi.js           # Simulates async fetch, seeds store, exposes retry
    │
    ├── utils/
    │   ├── formatters.js           # Currency (INR), date, percent, header date formatters
    │   ├── calculations.js         # All financial metric derivations — no logic in components
    │   └── exportData.js           # CSV and JSON browser download utilities
    │
    └── components/
        ├── layout/
        │   ├── Sidebar.jsx         # Fixed desktop nav with role switcher and theme toggle
        │   ├── Header.jsx          # Page title, date, export menu, add button
        │   └── MobileNav.jsx       # Bottom tab bar + GSAP slide-in drawer
        │
        ├── ui/                     # Stateless, reusable primitives
        │   ├── Badge.jsx           # Percentage change badge with directional icon
        │   ├── EmptyState.jsx      # Centred emoji + heading + subtext + action slot
        │   ├── SkeletonCard.jsx    # Shimmer placeholders — stat card and chart variants
        │   ├── Toast.jsx           # GSAP-animated notification system, auto-dismiss
        │   └── ExportMenu.jsx      # Dropdown for CSV/JSON export with GSAP open animation
        │
        ├── dashboard/
        │   ├── StatCard.jsx        # Animated counter card with change badge and hover lift
        │   ├── RevenueChart.jsx    # 12-month income vs expenses area chart
        │   ├── CategoryChart.jsx   # Top-6 spending categories bar chart
        │   └── DashboardPage.jsx   # Assembles stat cards, charts, recent tx, and insights
        │
        ├── transactions/
        │   ├── TransactionFilters.jsx  # Search input + type/category/sort dropdowns
        │   ├── TransactionRow.jsx      # Single transaction row with GSAP hover and delete
        │   ├── TransactionTable.jsx    # Full filtered, debounced, sortable transaction list
        │   └── AddTransactionModal.jsx # GSAP modal with form validation and type toggle
        │
        ├── insights/
        │   └── InsightsPanel.jsx   # Five live financial insight rows with stagger animation
        │
        └── analytics/
            ├── AnalyticsPage.jsx   # Bar, horizontal bar, and line charts + summary stats
            └── WalletPage.jsx      # Balance display, income ratio bar, account placeholders
```

---

## Getting Started

### Prerequisites

- Node.js **18+** (LTS recommended)
- npm 9+ or pnpm 8+

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### Installation

```bash
# 1. Clone or download the repository
git clone https://github.com/divyanshukmwt/Zorvyn.git
cd Zorvyn

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

On first load you will see skeleton loaders for approximately 1.4 seconds while the mock API simulation runs, then the dashboard animates in with the seed transaction data.

### Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

### Resetting Data

Transaction data, theme, and role are persisted to `localStorage` under the key `zorvyn-storage`. To reset to the seed data state, open DevTools → Application → Local Storage → delete the `zorvyn-storage` key, then refresh the page.

---

## Architecture Decisions

### State Management — Zustand with Selective Persistence

The global store lives in `src/store/useStore.js` and is created with Zustand's `create` function wrapped in the `persist` middleware.

**Why Zustand over Redux:** Redux requires action type constants, reducer functions, and selector wrappers before you can store a single value. For a self-contained dashboard, that ceremony is pure overhead. Zustand's store is a single `create` call where state and actions coexist.

**Why Zustand over React Context:** Context re-renders every subscriber when any part of the context changes. If `theme` and `transactions` lived in the same context, toggling dark mode would re-render every chart and transaction row. Zustand's selector API (`useStore((s) => s.transactions)`) means each component subscribes to exactly the slice it reads — no more, no less.

**Persistence strategy:** The `partialize` option in the `persist` middleware controls which slices reach `localStorage`. Only `transactions`, `theme`, and `role` are persisted:
- `transactions` — the core dataset must survive refresh
- `theme` — user preference should be remembered
- `role` — persisted so demos don't reset to Admin on every reload

`filters`, `page`, `isLoading`, and `toasts` are explicitly excluded. Filters should reset each session (opening to a pre-filtered view is unexpected UX). The `page` should always open to Dashboard. `isLoading` persisted as `true` would permanently show skeletons. `toasts` are ephemeral — a "Transaction added" notification from a previous session should never reappear.

---

### Custom Hooks — Why Not a Library

**`useDebounce`** — 10 lines. Adding `use-debounce` from npm for a single hook that has no edge cases in this codebase would be unnecessary. The custom version also debounces per-component rather than globally, which is the correct behaviour for a search input.

**`useAnimatedCounter`** — No library can do this cleanly. GSAP tweens a plain JavaScript object `{ value: 0 }` and calls `setState` on every animation frame via `onUpdate`. React Spring's `useSpring` could approximate it, but adding a second animation library just for number counters when GSAP is already the project's animation backbone would be redundant.

**`useLocalStorage`** — Used for one-off persistence outside the Zustand store. The hook's lazy initializer (`useState(() => JSON.parse(...))`) runs the localStorage read exactly once at mount rather than on every render.

**`useMockApi`** — Written as a hook (not a utility function) specifically because it needs access to Zustand store actions (`setLoading`, `hydrateTransactions`). The `transactions.length > 0` guard at the top means returning users with persisted data skip the mock delay entirely and see their dashboard instantly.

---

### Mock API Simulation

The mock API uses a `Promise` wrapping `setTimeout(resolve, 1400)`. The 1400ms delay is long enough to demonstrate the skeleton loader UX without feeling slow. The skeleton cards match the exact pixel dimensions of the real stat cards — same padding, same border radius, same block heights — which means there is zero Cumulative Layout Shift when real content replaces the placeholders.

In a real application, `useMockApi` would be replaced by a React Query `useQuery` call pointing at a real endpoint. The hook's return interface (`{ isLoading, error, retry }`) is intentionally identical to React Query's query object, making the swap a one-line change in the hook body.

---

### Dark Mode — CSS Variables + Tailwind's Class Strategy

The approach is a three-layer system:

**Layer 1 — CSS custom properties (`index.css`):** Two variable sets are defined: `:root` sets dark values by default. `html:not(.dark)` overrides them to light values. Any CSS class that references these variables responds to `.dark` toggling automatically.

**Layer 2 — Tailwind tokens (`tailwind.config.js`):** The `bg.dark`, `surface.dark`, and `card.dark` colour tokens are set to `var(--ff-bg)`, `var(--ff-surface)`, and `var(--ff-card)` respectively instead of hardcoded hex strings. This means every `bg-card-dark` class in every component now resolves through the variable — no component needs `dark:` variants.

**Layer 3 — Anti-flash script (`index.html`):** An inline synchronous script runs before any CSS or React paint. It reads the Zustand-persisted state from `localStorage`, extracts the `theme` field, and adds `.dark` to `<html>` if needed. Without this, users who prefer dark mode would see a brief white flash while React hydrates and fires its `useEffect`.

The `App.jsx` theme effect simply adds or removes `.dark` from `document.documentElement` when the Zustand `theme` value changes — nothing more complex is needed.

---

### Role-Based UI

The `role` field in the Zustand store (`"admin"` | `"viewer"`) gates three UI surfaces:

1. **Add Transaction button** in `Header.jsx` — rendered conditionally: `role === 'admin' && <button>`
2. **Delete button** on each `TransactionRow` — same pattern
3. **Modal mount** in `App.jsx` — `showModal && role === 'admin' && <AddTransactionModal />` — even if a savvy user called `setShowModal(true)` from the console, the modal JSX condition prevents it rendering

This is a client-side gate appropriate for a demo. In a production system:
- The `role` field would come from a decoded JWT claim on login, not from a UI toggle
- The `role` would be removed from Zustand's `persist` config, since it's authoritative from the server
- Destructive and write operations would be gated server-side with 403 responses regardless of client state
- The client gates remain for UX only — they hide irrelevant controls, they do not enforce security

---

### Financial Calculations

All financial logic lives exclusively in `src/utils/calculations.js`. No component performs any arithmetic directly — every number displayed is derived by calling a utility function. This means changing a business rule (for example, excluding Investment category from the savings rate calculation) requires editing one function in one file.

Key derivations:
- **Stat card percentage changes** — `getStatCardMetrics` filters transactions by the current and previous calendar month (using `date.startsWith('YYYY-MM')`), calculates income/expenses for each, and returns six numbers including `getPercentChange(newValue, oldValue)` for each metric
- **Category breakdown** — `getExpensesByCategory` groups expense transactions by category using `Array.reduce` into a plain object, converts to a sorted array, and is consumed by both `CategoryChart` and `InsightsPanel`
- **Monthly savings trend** — `getMonthlySavingsTrend` groups all transactions by `YYYY-MM` string and returns a chronologically sorted array of `{ month, savings, income, expenses }` objects for the Analytics page's line chart
- **Best/worst months** — `getMonthlyAnalytics` uses `Array.reduce` over the savings trend to find the maximum and minimum savings months, and calculates an average

---

## Development History

This project was built iteratively across multiple development sessions following a deliberate feature-by-feature approach. The commit history reflects the natural order of a real development process: project scaffolding first, then the data layer and global state, then utilities, then custom hooks, then the UI shell, then individual features one at a time, and finally integration and bug fixes. This structure was intentional — each commit represents a coherent, standalone unit of work rather than a bulk dump of files. Anyone reading the git log can follow the development arc from configuration through to polish.

---

## What a Real Backend Would Add

Zorvyn is currently a fully client-side application. Connecting it to a real backend would require the following changes, none of which would require restructuring the existing codebase:

| Feature | Change required |
|---|---|
| **Authentication** | Add a login page; store JWT in `httpOnly` cookie; decode role claim and call `setRole()` on app init; remove `role` from Zustand `persist` |
| **Real transaction API** | Replace `useMockApi` internals with `fetch('/api/transactions')`; the hook's return interface stays identical |
| **Server-side filtering** | Pass filter state as query params to the API; the `TransactionFilters` component doesn't change |
| **Real export** | Hit a server endpoint that returns a pre-built file; `exportData.js` functions stay the same shape |
| **Multi-user support** | Transactions stored per user in the database; the `persist` middleware `partialize` function drops `transactions` (they come from the API, not localStorage) |
| **Real-time updates** | Add a WebSocket subscription in `useMockApi`; call `addTransaction` on incoming events; no component changes |

The custom hooks, calculation utilities, and Zustand action interfaces are all designed with this upgrade path in mind. The mock API hook was built with the same interface as React Query deliberately — swapping the implementation is a single file change.

---

## License

MIT
