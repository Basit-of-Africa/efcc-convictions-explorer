# Components Guide

Detailed guide to React components in the frontend.

## Component Hierarchy

```
App
└── Dashboard
    ├── SearchBar
    ├── StatsPanel
    └── DataTable
```

## DataTable Component

Displays conviction records in a table with pagination.

**Location**: `src/components/DataTable.jsx`

**Props**:
- `convictions: Array` - Records to display
- `loading: Boolean` - Loading state
- `pagination: Object` - Pagination metadata
- `onNextPage: Function` - Next page handler
- `onPrevPage: Function` - Previous page handler
- `onFilterByOffense: Function` - Offense filter handler
- `onFilterByCourt: Function` - Court filter handler

## SearchBar Component

Input component for searching by defendant name.

**Location**: `src/components/SearchBar.jsx`

**Props**:
- `onSearch: Function` - Search callback
- `onReset: Function` - Reset callback

## StatsPanel Component

Displays key statistics about the dataset.

**Location**: `src/components/StatsPanel.jsx`

**Props**:
- `stats: Object` - Statistics object from API

## Dashboard Component

Main orchestration component managing state and API calls.

**Location**: `src/pages/Dashboard.jsx`

**Responsibilities**:
- Fetch data from API
- Manage component state
- Handle user interactions
- Coordinate pagination

See [Frontend Overview](./overview.md) for architecture details.
