# EFCC Convictions Explorer - Frontend

A modern React + Vite dashboard for exploring and analyzing EFCC conviction records.

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

The dashboard automatically connects to the backend API at `http://localhost:8000` and provides:

- **Health Check**: Verifies API connectivity
- **Statistics Panel**: Shows total cases, courts, offenses, and average prison terms
- **Search Bar**: Real-time defendant search
- **Data Table**: Paginated conviction records with quick filters
- **Pagination**: Navigate through large datasets
