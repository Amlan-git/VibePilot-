# VibePilot - Social Media Management Platform

VibePilot is an entry for the KendoReact Free Components Challenge 2025. It showcases how KendoReact’s free tier components can be combined with AI (via Cohere) to build a modern, responsive social media management tool — featuring post scheduling, AI-assisted content creation, and engagement analytics.

## KendoReact Free Components Challenge 2025: https://dev.to/challenges/kendoreact

## Features

### Post Management
- Create, edit, and delete posts for multiple social media platforms
- Rich text editor for content creation
- Tag management for easy organization
- Bulk operations for efficient workflow

### Content Calendar
- Visual scheduling interface for posts
- Multiple calendar views (day, week, month, list)
- Drag-and-drop post rescheduling
- Post density visualization
- Best time to post recommendations
- Platform conflict detection

### AI Assistant
- AI-powered content enhancement and optimization
- Smart content rewriting and suggestions
- Hashtag recommendations for improved discoverability
- Chat-based AI assistant for content ideation
- Multi-platform content optimization
- Tone and style customization

### Analytics (Coming Soon)
- Engagement metrics across platforms
- Audience growth tracking
- Content performance analysis
- Custom reporting

## Technology Stack

- **Frontend:** React, TypeScript, KendoReact UI Components
- **State Management:** React Query, React Context
- **Routing:** React Router
- **HTTP Client:** Axios
- **UI Framework:** KendoReact
- **AI Integration:** Cohere API

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Cohere API key for AI features

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vibepilot.git
cd vibepilot
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_BASE_URL=https://api.vibepilot.example/v1
VITE_COHERE_API_KEY=your-cohere-api-key
```

4. Start the development server
```bash
npm run dev
```

## Development

### Project Structure

```
vibepilot/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── calendar/      # Content Calendar components
│   │   ├── common/        # Shared components
│   │   └── posts/         # Post Management components
│   ├── features/
│   │   ├── ai/            # AI Assistant components and types
│   │   ├── dashboard/     # Dashboard components
│   │   └── posts/         # Post management features
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready app
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

## AI Features Configuration

The AI Assistant features require a valid Cohere API key to function. You can get one by signing up at [Cohere](https://cohere.ai/).

Once you have your API key, add it to your `.env` file:

```
VITE_COHERE_API_KEY=your-cohere-api-key
```

Without a valid API key, the AI features will operate in demo mode with static responses.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [KendoReact](https://www.telerik.com/kendo-react-ui/) for the UI components
- [React Query](https://react-query.tanstack.com/) for data fetching
- [React Router](https://reactrouter.com/) for routing
- [Cohere](https://cohere.ai/) for AI-powered content generation 
