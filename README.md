# Semantic Kernel FED Starter

A modern, real-time chat application built with React/TypeScript frontend and SignalR integration for seamless communication with AI agents. This project provides a complete chat interface with multiple AI agent modes, streaming responses, and tool call visualization.

## ✨ Features

- **🤖 Multiple AI Agent Modes**
  - Azure AI Agent: Direct Azure AI assistance
  - Chat Completion Agent: Educational tutoring assistant
  - Smart Handoff: Intelligent agent switching

- **⚡ Real-time Communication**
  - SignalR integration for instant messaging
  - Token-by-token streaming responses
  - Live tool call visualization

- **🎨 Modern UI/UX**
  - Built with shadcn/ui components
  - Tailwind CSS styling
  - Responsive design

### Backend Integration
This frontend is designed to work with a C# SignalR ChatHub that should implement:

```csharp
public class ChatHub : Hub
{
    public async Task JoinSession(string sessionId) { /* ... */ }
    public async Task LeaveSession(string sessionId) { /* ... */ }
    public async Task ProcessMessage(string message, string sessionId, AgentMode agentMode) { /* ... */ }
    
    // Client callbacks
    public async Task SendToolCall(string tool, string input, string output) { /* ... */ }
    public async Task SendFinalResponse(string response) { /* ... */ }
    public async Task ReceiveStreamingChunk(string chunk) { /* ... */ }
}
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm)
- **npm** or **yarn** or **bun**
- A **C# SignalR backend** (see Backend Requirements below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-garden-oasis
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SIGNALR_HUB_URL=http://localhost:5038/chathub
```

### SignalR Hub URL

The application expects a SignalR hub at the configured URL (default: `http://localhost:5038/chathub`). Update the URL in:
- Environment variables (recommended)
- `src/services/signalRService.ts` (for hardcoded configuration)

## 🛠️ Backend Requirements

To use this frontend, you'll need a C# SignalR backend with the following implementation:

### Required Hub Methods

```csharp
public class ChatHub : Hub
{
    // Session management
    public async Task JoinSession(string sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
    }

    public async Task LeaveSession(string sessionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
    }

    // Message processing
    public async Task ProcessMessage(string message, string sessionId, AgentMode agentMode)
    {
        // Process message with your AI service
        // Send streaming responses via SendStreamingChunk
        // Send tool calls via SendToolCall
        // Send final response via SendFinalResponse
    }
}
```

### Required Client Events

Your backend should emit these events to the frontend:

- **`ReceiveStreamingChunk`** - For token-by-token streaming
- **`onToolCall`** - For tool execution visualization  
- **`onFinalResponse`** - For final AI response

### Agent Mode Enum

Ensure your C# backend includes this enum:

```csharp
public enum AgentMode
{
    AzureOnly,
    TutorOnly,
    QuizOnly,
    HandoffOrchestration
}
```

## 🏃‍♂️ Usage

1. **Start your SignalR backend** on the configured port (default: 5038)

2. **Launch the frontend** using `npm run dev`

3. **Open the application** in your browser

4. **Select an AI agent** from the dropdown in the chat header

5. **Start chatting!** 
   - Type your message and press Enter
   - Watch real-time streaming responses
   - See tool calls as they happen
   - Switch agents anytime (clears chat history)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AgentSelector.tsx    # Agent mode selection
│   ├── ChatInterface.tsx    # Main chat UI
│   └── ui/                  # shadcn/ui components
├── contexts/           # React contexts
│   └── ChatContext.tsx     # Chat state management
├── hooks/              # Custom React hooks
│   └── useSignalR.ts       # SignalR connection hook
├── services/           # External services
│   └── signalRService.ts   # SignalR communication
├── types/              # TypeScript definitions
│   └── agentMode.ts        # Agent mode types
└── pages/              # Page components
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Customizing UI

The project uses shadcn/ui components which can be customized through:
- `tailwind.config.ts` - Theme configuration
- `src/index.css` - Global styles
- Component-level styling with Tailwind classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🎯 Roadmap
- [ ] Add more multi agent orchestration examples
- [ ] Enable tool streaming
- [ ] Message persistence
- [ ] File upload support

---

**Built with ❤️ using React, TypeScript, and SignalR**
