# EcomCart Frontend - Next.js

This is the EcomCart e-commerce frontend application built with Next.js 14.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (default: http://localhost:8082)

### Installation

1. Install dependencies:
```bash
npm install
```

### Configuration

The application uses environment variables for configuration. 

**Important:** Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8082/api/v1
```

For production or different environments, update the endpoint URL in `.env.local`.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:8081](http://localhost:8081) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_ENDPOINT` - Backend API endpoint URL (required)

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── providers/        # Context providers
│   └── config.js         # Configuration
├── public/              # Static assets
└── package.json         # Dependencies
```

## Features

- User authentication (Login/Register)
- Product browsing and search
- Shopping cart management
- Checkout with address management
- Modern Next.js 14 with App Router
- Material-UI components
- Responsive design

