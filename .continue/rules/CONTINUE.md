# Project Guide: The Disc Mill

This document serves as a comprehensive guide for developers working on "The Disc Mill" codebase. It provides an overview of the project architecture, development workflow, and key concepts.

## 1. Project Overview
**The Disc Mill** is a specialized web application designed for the disc golf community. It provides a robust platform for exploring disc catalogs, finding courses, building virtual bags, and tracking player/event information.

### Key Technologies
- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4 (utilizing modern features like `@tailwindcss/vite`)
- **Language:** TypeScript
- **Animations:** Motion (formerly Framer Motion)
- **Icons:** Lucide React
- **Routing:** React Router 7

## 2. Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or bun

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create a production build:
```bash
npm run build
```

## 3. Project Structure

The project follows a modular, component-driven architecture.

### Core Directories
- `src/components/`: Reusable UI components.
  - `ui/`: Low-level primitive components (e.g., Skeleton).
  - `DiscCard.tsx`: The primary component for displaying disc information in grids.
  - `Navbar.tsx`: Main navigation component.
- `src/pages/`: Route-specific components representing full views (e.g., `Discs.tsx`, `BagBuilder.tsx`).
- `src/services/`: Business logic and data management layer. This is where data fetching, filtering, and domain-specific logic reside (e.g., `discs.ts`, `manufacturers.ts`).
- `src/hooks/`: Custom React hooks for shared stateful logic (e.g., `useDiscFinder.ts`).
- `src/types/`: Centralized TypeScript interfaces and type definitions.
- `src/utils/`: Pure helper functions and utility logic (e.s., physics calculations, encoding).
- `src/constants/`: Static configuration and fixed data.

## 4. Development Workflow

### Coding Standards
- **TypeScript:** Always define interfaces for new components and services to ensure type safety.
- **Tailwind CSS 4:** Use utility classes for all styling. Avoid writing custom CSS unless absolutely necessary for complex animations or third-party integrations.
- **Component Architecture:** When creating new features, aim for small, single-responsibility components that can be reused.

### Testing & Validation
- Ensure any changes to `DiscCard` or brand grids are visually validated against the design requirements (contrast, padding, etc.).
- Use `npm run lint` to check for TypeScript and coding standard errors.

### Data Updates
To add new discs, manufacturers, or courses:
1. Identify the relevant service file in `src/services/`.
2. Update the data structure or the underlying data source (if applicable).
3. Run the development server to verify the changes are reflected in the UI.

## 5. Key Concepts

### Domain Terminology
- **Flight Numbers:** A set of four numbers (Speed, Glide, Turn, Fade) that describe a disc's flight characteristics.
- **Stability:** The tendency of a disc to resist or succumb to turning during flight.
- **Manufacturer/Brand:** The company that produces the disc (e.g., Innova, Discraft).

### Core Abstractions
- **DiscCard Component:** The standard unit of display for discs across various views (Grid, Search results, Bag Builder).

## 6. Common Tasks

### Adding a new Disc Brand
1. Open `src/services/manufacturers.ts`.
2. Add the new brand object to the manufacturer list.
3. Update any related components or pages that might need to reference this brand specifically.

### Creating a New Page
1. Create a new file in `src/pages/`.
2. Register the new route in your main router configuration (usually `App.tsx`).

## 7. Troubleshooting

- **Tailwind styles not updating:** Since we use `@tailwindcss/vite`, ensure you are running through `npm run dev` so the Vite plugin can process the CSS changes.
- **TypeScript Errors after dependency update:** Run `npm install` and then `npm run lint` to identify broken types.
- **Data not appearing:** Check the `src/services/` files to ensure the new data is correctly integrated into the service's return values.

## 8. References
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [React 19 Documentation](https://react.dev/)
- Project internal docs in `/docs`
```
