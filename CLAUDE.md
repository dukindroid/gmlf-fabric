# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js React application bootstrapped with `create-next-app`. It's a standard Next.js project using React 17 and Next.js 10.0.5. It will be used to present a UI after Claude analizes the manuals extracted to the `/docs` directory. The objective of this UI is to present the data extracted from these manuals in a friendly, summarized form, with access via link to the full info when needed. 

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server

## Architecture

This is a standard Next.js application with the following structure:

### Core Components
- `pages/_app.js` - Main App component that wraps all pages with global CSS
- `pages/index.js` - Home page component with default Next.js starter content
- `pages/api/hello.js` - Sample API route returning JSON response

### Styling
- `styles/globals.css` - Global CSS styles applied to all pages
- `styles/Home.module.css` - CSS modules for the home page component

### Static Assets
- `public/` - Static files served directly (favicon, Vercel logo)
- `docs/` - Manuals and reference sheets of a recently installed mining equipment on our mining site.

## Key Conventions

- Uses CSS Modules for component-specific styling
- API routes are in `pages/api/` directory and mapped to `/api/*` URLs
- Pages are file-based routing in the `pages/` directory
- Global styles imported in `_app.js`