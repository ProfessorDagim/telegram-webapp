# DE OMNI Frontend

This is the frontend application for DE OMNI, an AI-powered chat interface that connects to the FastAPI backend.

## Features

- 🎨 Modern, sci-fi inspired UI with animations
- 💬 Real-time chat interface
- 🤖 AI-powered responses via DeepSeek API
- 📱 Responsive design
- 🔗 Backend connectivity status indicator

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see main README.md)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the backend URL:
   - Edit `config.ts` and update the `backendUrl` to point to your backend server
   - Default is `http://localhost:8000`

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Backend Connection

The frontend connects to the backend via the `/chat` endpoint. Make sure:

1. The backend server is running
2. CORS is properly configured (already done in the backend)
3. The backend URL in `config.ts` is correct

## Environment Variables

You can set the backend URL using environment variables:

```bash
NEXT_PUBLIC_BACKEND_URL=http://your-backend-url:8000
```

## Project Structure

```
telegram-webapp/
├── app/
│   ├── chat/          # Chat interface
│   ├── page.tsx       # Landing page
│   └── layout.tsx     # Root layout
├── components/        # UI components
├── lib/
│   └── api.ts        # API service
├── config.ts         # Configuration
└── package.json
```

## Troubleshooting

### Connection Issues
- Check if the backend server is running
- Verify the backend URL in `config.ts`
- Check browser console for CORS errors
- Ensure the backend has the correct CORS origins configured

### Build Issues
- Clear `.next` folder and rebuild
- Check Node.js version compatibility
- Verify all dependencies are installed
