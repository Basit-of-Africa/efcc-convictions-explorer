# Glossary

Terminology and definitions used in EFCC Convictions Explorer.

## A

**API** (Application Programming Interface)
A set of rules and protocols for building software applications. Our REST API allows external programs to access conviction data.

**Axios**
A popular JavaScript HTTP client library used in the frontend to make requests to the backend API.

## B

**Backend**
The server-side application (FastAPI) that processes data and provides the REST API.

**Batch Processing**
Processing large amounts of data in groups rather than individually, improving efficiency.

## C

**CORS** (Cross-Origin Resource Sharing)
A security protocol that allows web pages to request resources from different domains.

**CSV** (Comma-Separated Values)
A file format for storing tabular data. Our conviction records are stored as CSV.

**Conviction**
A formal judgment of guilt pronounced by a court.

## D

**Dashboard**
The main user interface of the frontend showing conviction data, statistics, and search functionality.

**Data Cleaning**
The process of transforming raw data into a consistent, usable format. Examples: removing special characters, standardizing text.

**Database**
Structured storage of data. Currently CSV-based, can be migrated to SQL.

**Defendant**
A person accused or convicted of a crime.

## E

**EFCC**
Economic and Financial Crimes Commission - the Nigerian agency responsible for investigating financial crimes.

**Endpoint**
A specific URL in the API that performs a particular function (e.g., `/search`, `/stats`).

**Ensemble**
A collection of components working together. The frontend and backend work as an ensemble.

## F

**FastAPI**
A modern Python web framework for building REST APIs.

**Frontend**
The client-side application (React) that users interact with to view and search data.

**Filter**
Narrowing down results based on specific criteria (e.g., offense type, court).

## G

**Git**
A version control system for tracking code changes.

**GitHub**
A platform for hosting and collaborating on Git repositories.

**GitBook**
A platform for creating and hosting documentation (like this guide).

## H

**HTTP** (HyperText Transfer Protocol)
The protocol used for transferring data over the web.

**HTTP Status Code**
A response code indicating the result of an HTTP request (e.g., 200 for success, 404 for not found).

## I

**Index**
A data structure that speeds up queries. Database indexes improve search performance.

**Intersection**
The matching records between multiple search/filter criteria.

## J

**JSON** (JavaScript Object Notation)
A lightweight data format used for API responses. Example:
```json
{
  "name": "JOHN DOE",
  "offense": "FRAUD"
}
```

## L

**Limit**
The maximum number of records returned in a single API response.

**Lucide**
An icon library providing SVG icons used in the UI.

**Life Sentence**
A prison term of indefinite length, typically lasting until death or parole eligibility.

## M

**Middleware**
Software that sits between the requests and the application, handling common tasks like CORS, logging, etc.

**Migration**
Moving data from one system to another (e.g., CSV to SQL database).

**Module**
A reusable piece of code, often in a separate file.

**npm** (Node Package Manager)
A tool for managing JavaScript libraries and dependencies.

## N

**Node.js**
A JavaScript runtime environment for running JavaScript outside the browser.

**Normalization**
The process of organizing data consistently (e.g., converting all text to uppercase).

## O

**Offset**
In pagination, the number of records to skip before returning results.

## P

**Pagination**
Dividing results into pages for easier navigation. Example: 20 records per page.

**Pydantic**
A Python library for data validation using type hints.

**Python**
The programming language used for the backend API.

## R

**React**
A JavaScript library for building user interfaces with reusable components.

**REST** (Representational State Transfer)
An architectural style for designing networked applications using HTTP methods.

**Restitution**
Money ordered by a court to be paid to victims or their families.

**Regex** (Regular Expression)
A pattern for matching and manipulating strings.

## S

**Schema**
The structure of data, defining fields, types, and relationships.

**Search**
Finding records based on criteria (e.g., defendant name).

**Serialization**
Converting data from one format to another (e.g., Python object to JSON).

**SQL** (Structured Query Language)
A language for managing relational databases.

**SSR** (Server-Side Rendering)
Rendering web pages on the server instead of in the browser.

**State**
The current condition of an application or component.

## T

**Tailwind CSS**
A utility-first CSS framework for styling web applications.

**Terminal/Command Line**
A text-based interface for running commands on your computer.

**Token/JWT**
A secure string used for authentication (not currently used in this app).

## U

**Uvicorn**
An ASGI web server for running FastAPI applications.

**Union**
Combining results from multiple queries.

## V

**Validation**
Checking that data meets required standards before processing.

**Vite**
A fast build tool for JavaScript projects.

**Virtual Environment**
An isolated Python environment for project dependencies.

## W

**Webhook**
An HTTP callback triggered when specific events occur.

**Whitespace**
Space characters (spaces, tabs, line breaks) in text.

## X

**XML** (eXtensible Markup Language)
A data format (not used in this project; we use JSON instead).

## Y

**YAML** (YAML Ain't Markup Language)
A human-readable data format sometimes used for configuration.

## Z

**Zero-Based Indexing**
Counting from 0 instead of 1. Offset 0 refers to the first record.

---

## Related Sections

- [Data Schema](./architecture/data-schema.md) - Understanding data structure
- [API Documentation](./api/overview.md) - API terminology

**Documentation Version**: 1.0.0
