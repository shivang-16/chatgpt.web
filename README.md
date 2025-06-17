


          
Here's a README.md file for your ChatGPT web application project:

```markdown:/Users/shivang/Desktop/chatgpt.web/README.md
# ChatGPT Web Application

A Next.js-based web application that mimics ChatGPT functionality with features like:
- Real-time chat with AI assistant
- File uploads (images, PDFs)
- Chat history management
- User authentication

## Features

- **Chat Interface**:
  - Real-time streaming responses
  - Code block syntax highlighting
  - File previews (images and PDFs)
  - Copy functionality with visual feedback

- **File Handling**:
  - Upload images, PDFs and other documents
  - Preview files before sending
  - Cloudinary integration for file storage

- **Authentication**:
  - Google OAuth login
  - Protected routes
  - User session management

- **Chat Management**:
  - Create new chats
  - View chat history in sidebar
  - Persist chat messages

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Redux Toolkit
  - React Hook Form

- **Backend**:
  - Next.js API routes
  - Gemini API integration
  - MongoDB (via Mongoose)

- **Other**:
  - Google OAuth
  - Cloudinary for file storage
  - React Hot Toast for notifications

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (create `.env` file based on `.env.example`)
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables (see `.env.example`):

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
MONGODB_URI=your_mongodb_connection_string
```

## Project Structure

Key directories:

```
/src
├── actions/          # Server actions
├── app/              # Next.js app router
│   ├── (auth)        # Authentication routes
│   ├── (root)        # Main application
│   └── api/          # API routes
├── components/       # UI components
├── lib/              # Utility functions
├── redux/            # Redux store and slices
└── types/            # TypeScript types
```

