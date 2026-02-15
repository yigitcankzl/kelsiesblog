# Kelsie's Blog

A personal blog application built with React, TypeScript, and Vite. This project features an interactive map to explore stories based on location, a gallery for photos, and an admin panel for managing content.

## Features

- **Interactive Map**: Visualize story locations on a map using Leaflet.
- **Stories**: Read blog posts with rich text and images.
- **Gallery**: Browse a collection of photos.
- **Admin Dashboard**: Secure area to add, edit, and delete stories and gallery items.
- **Authentication**: Firebase Authentication for admin access.
- **Responsive Design**: Fully responsive layout using Tailwind CSS.
- **Dark Mode**: Support for dark mode styling.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React
- **State Management**: Zustand
- **Routing**: React Router
- **Maps**: React Leaflet, Leaflet
- **Backend/Database**: Firebase (Firestore, Authentication, Storage)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kelsiesblog.git
   cd kelsiesblog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Previews the production build locally.

## License

This project is open source and available under the MIT License.
