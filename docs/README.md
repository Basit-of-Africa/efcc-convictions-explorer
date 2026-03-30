# Nigeria's Fraud Conviction Records

Welcome to the comprehensive documentation for the **Nigeria's Fraud Conviction Records** platform — a modern, full-stack application for searching, analyzing, and exploring fraud conviction records from Nigeria's federal courts.

## 🎯 What is Nigeria's Fraud Conviction Records?

Nigeria's Fraud Conviction Records is a powerful web application that provides:

- **Searchable Database** - Access 7,788+ conviction records with detailed information
- **Advanced Filtering** - Filter by offense type, court, defendant name, and more
- **Statistical Analytics** - View aggregate data about convictions, courts, offense patterns
- **Modern UI** - User-friendly React dashboard for easy navigation
- **RESTful API** - Robust backend API for programmatic access
- **Data Quality** - Cleaned, standardized, and validated conviction data

## 📊 Key Statistics

- **Total Records**: 7,788 convictions (2020-2024)
- **Courts**: 33+ unique courts across Nigeria
- **Offense Types**: 50+ different offense categories
- **Data Coverage**: Complete fraud conviction records from Nigeria's federal courts
- **Data Source**: Public court records and official proceedings (2020-2024)

## 🚀 Quick Links

- [Getting Started](guides/getting-started.md) - Setup and installation
- [API Documentation](api/overview.md) - REST API reference
- [Frontend Guide](frontend/overview.md) - React dashboard walkthrough
- [Data Schema](architecture/data-schema.md) - Database structure
- [Deployment](guides/deployment.md) - Production deployment
- [Contributing](contributing/guidelines.md) - Contribution guidelines

## 💡 Platform Architecture

The platform consists of two main components:

### **Backend (FastAPI)**
- RESTful API for data access
- Data processing and cleaning
- Statistical analysis endpoints
- Running on `http://localhost:8000`

### **Frontend (React + Vite)**
- Modern, responsive dashboard
- Interactive data visualization
- Search and filtering interface
- Running on `http://localhost:3000`

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite, Tailwind CSS | User interface & dashboard |
| **Backend** | FastAPI, Uvicorn, Pandas | API & data processing |
| **Database** | CSV (pandas DataFrame) | Data storage |
| **DevOps** | Git, GitHub, Docker-ready | Version control & deployment |

## 📖 Documentation Structure

This documentation covers:

1. **Getting Started** - Installation, setup, and quick start
2. **User Guide** - How to use the platform
3. **API Reference** - Complete REST API documentation
4. **Frontend Guide** - React frontend architecture
5. **Architecture** - System design and data flow
6. **Deployment** - Production deployment guide
7. **Contributing** - How to contribute to the project
8. **FAQ & Troubleshooting** - Common questions and solutions

## 🔐 Security & Privacy

- No user authentication required for data access
- Public fraud conviction records from Nigeria's federal courts
- Data is read-only (no modifications to source data)
- All personal information is from public records

## 📝 License

[Add your license information here]

## 🤝 Support

For questions, issues, or suggestions:
- Check the [FAQ](faq.md) section
- Review [Troubleshooting](troubleshooting.md) guide
- Check [API Documentation](api/overview.md)

---

**Last Updated**: March 30, 2026  
**Version**: 1.0.0
