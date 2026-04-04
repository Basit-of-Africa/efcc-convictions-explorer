# Nigeria's Fraud Conviction Records - Frontend

A modern React + Vite dashboard for exploring and analyzing fraud conviction records from Nigeria's federal courts.

## Features

- 🔍 **Search** - Find convictions by defendant name
- 📊 **Statistics** - View aggregate data and trends
- 📋 **Data Tables** - Browse records with pagination
- 🎯 **Filtering** - Filter by offense type and court
- ⚡ **Fast** - Built with Vite for optimal performance
- 🎨 **Beautiful UI** - Tailwind CSS styled components

## Setup

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Configure API URL
Create `Frontend/.env.local` when the frontend needs to talk to a remote or tunneled backend:

```bash
VITE_API_URL=https://your-api-subdomain.opentunnel.dev
```

Without `VITE_API_URL`, the app only falls back to `http://127.0.0.1:8000` when opened locally on `localhost`.

### Build for Production
```bash
npm run build
```

## Requirements

- Backend API running on `http://localhost:8000`
- Node.js 16+
- npm or yarn

## Architecture

- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Usage

For local development, the dashboard automatically connects to `http://127.0.0.1:8000`.

For OpenTunnel or any remote frontend URL, set `VITE_API_URL` to the backend tunnel URL before starting Vite so browser requests do not point to the visitor's own localhost.

The dashboard provides:

- **Health Check**: Verifies API connectivity
- **Statistics Panel**: Shows total cases, courts, offenses, and average prison terms
- **Search Bar**: Real-time defendant search
- **Data Table**: Paginated conviction records with quick filters
- **Pagination**: Navigate through large datasets
