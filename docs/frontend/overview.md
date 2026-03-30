# Frontend Overview

The EFCC Convictions Explorer frontend is a modern React application built with Vite, providing an intuitive interface for searching and analyzing conviction records.

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.0.0 | Build tool |
| Tailwind CSS | 3.3.0 | Styling |
| Axios | 1.6.0 | HTTP client |
| Lucide React | 0.263.1 | Icons |

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── DataTable.jsx    # Conviction data table
│   │   ├── SearchBar.jsx    # Search input component
│   │   └── StatsPanel.jsx   # Statistics display
│   ├── pages/               # Page components
│   │   └── Dashboard.jsx    # Main dashboard
│   ├── services/            # API integration
│   │   └── api.js          # API client
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── index.html              # HTML template
```

## Key Features

### 🔍 Search Functionality
- Real-time defendant name search
- Partial string matching
- Clear search button
- Results count display

### 📊 Statistics Panel
- Total conviction cases
- Number of unique courts
- Offense type count
- Average prison term
- Most common offense

### 📋 Data Table
- 20 records per page
- Sortable columns
- Interactive filtering
- Pagination controls
- Responsive design

### ⚡ Performance
- Vite for fast development & builds
- Lazy loading
- Optimized bundle size
- Fast page loads

### 📱 Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop full experience
- Touch-friendly controls

## Main Components

### Dashboard
Main page that orchestrates all other components and API interactions.

**File**: `src/pages/Dashboard.jsx`

**Features**:
- Data loading and state management
- Search and filter handling
- Pagination logic
- Error handling

### SearchBar
Input component for defendant name search.

**File**: `src/components/SearchBar.jsx`

**Props**:
- `onSearch(query)` - Callback when search submitted
- `onReset()` - Callback to clear search

### StatsPanel
Displays aggregate statistics about the dataset.

**File**: `src/components/StatsPanel.jsx`

**Props**:
- `stats` - Statistics object from API

### DataTable
Renders conviction records in a table format with pagination.

**File**: `src/components/DataTable.jsx`

**Props**:
- `convictions` - Array of records
- `loading` - Loading state
- `pagination` - Pagination info
- `onNextPage()` - Next page callback
- `onPrevPage()` - Previous page callback
- `onFilterByOffense(offense)` - Filter callback
- `onFilterByCourt(court)` - Filter callback

## API Integration

The frontend communicates with the backend API through the `api.js` service:

```javascript
import { convictionsAPI } from '../services/api';

// Get all convictions
const response = await convictionsAPI.getConvictions(limit, offset);

// Search by name
const results = await convictionsAPI.searchByName(name, limit, offset);

// Filter by offense
const filtered = await convictionsAPI.filterByOffense(type, limit, offset);

// Get statistics
const stats = await convictionsAPI.getStats();
```

## Styling

The frontend uses **Tailwind CSS** for styling with a custom color scheme:

```javascript
// Primary colors
bg-primary: #1f2937 (dark gray)
bg-secondary: #3b82f6 (blue)

// Utility classes
bg-gray-50, bg-white, border, rounded-lg, etc.
```

## Development

### Start Dev Server
```bash
cd frontend
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## State Management

Currently uses React hooks for local state:
- `useState` - Component state
- `useEffect` - Side effects
- Props drilling for component communication

**For larger apps**, consider Redux or Zustand.

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Tips

1. **Pagination** - Load 20 records at a time
2. **Caching** - Stats are loaded once on init
3. **Code Splitting** - Vite handles automatic chunking
4. **Lazy Loading** - Consider lazy-loading components for larger app

---

**Next**: [Component Guide](./components.md) | [Development](./development.md)

**Documentation Version**: 1.0.0
