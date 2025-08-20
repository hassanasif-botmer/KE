# Overview

This is a Karachi Energy Monitoring System - a full-stack web application for tracking electricity consumption, temperature monitoring, and billing analysis. The system provides real-time dashboards for energy usage patterns, temperature readings, and KE (K-Electric) billing calculations with slab-based tariff structures.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management
- **Charts**: Recharts library for data visualization (line charts, bar charts, area charts)
- **Layout**: Fixed sidebar navigation with main content area

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage Interface**: Abstract storage layer with in-memory implementation
- **API Design**: RESTful endpoints for energy readings, temperature data, and billing calculations
- **Development Server**: Vite integration for hot module replacement in development

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but currently using in-memory storage)
- **Schema**: Type-safe database schemas with Zod validation
- **Tables**: Energy readings, temperature readings, and billing slabs
- **Migrations**: Drizzle migrations setup in `/migrations` directory

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session configuration present but not utilized

## External Dependencies

### Database Services
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store (configured but not used)

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating type-safe component variants
- **Recharts**: Composable charting library for React

### Development Tools
- **Vite**: Fast build tool and development server
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **date-fns**: Date utility library
- **drizzle-zod**: Zod schema generation from Drizzle schemas

The application follows a layered architecture with clear separation between frontend presentation, backend API logic, and data persistence layers. The modular design allows for easy extension and maintenance while providing type safety throughout the stack.