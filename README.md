
CreatorPilot 🚀
CreatorPilot is a comprehensive suite of AI-powered tools designed to help YouTube creators streamline their workflow, generate engaging content, and gain data-driven insights to grow their channels.

✨ Features
CreatorPilot offers a range of powerful features to supercharge your content creation process:

🤖 AI Content Generator: Overcome writer's block by generating video titles (with SEO scores), descriptions, and relevant tags from a single topic.

🖼️ AI Thumbnail Generator: Create unique, eye-catching thumbnails from a text prompt. You can also provide a reference image to guide the AI's style.

🔍 Smart Thumbnail Search: Find visually similar thumbnails across YouTube by simply clicking on an image, helping you analyze trends and competition.

📈 Outlier Detection: Analyze your channel's videos to statistically identify which ones are performing exceptionally well (or poorly) compared to your average.

🔑 Trending Keyword Analysis: Discover what's hot on both Google and YouTube. Get a list of high-ranking keywords, SEO scores, and related queries for any topic.

🛠️ Tech Stack
This project is built with a modern, scalable, and type-safe stack:

Framework: Next.js (React)

Styling: Tailwind CSS with shadcn/ui for UI components

Authentication: Clerk for user management and authentication

Database: PostgreSQL (hosted on Neon)

ORM: Drizzle ORM for type-safe database queries

Background Jobs: Inngest for handling long-running, asynchronous AI tasks

AI Integrations:

OpenAI / OpenRouter: For language models (content generation, keyword analysis)

Replicate / Google Imagen: For image generation (thumbnails)

Deployment: Vercel

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18.0 or higher)

npm, yarn, or bun

Installation
Clone the repo

Bash

git clone https://github.com/ParthDedhia1304/creatorpilot.git
Install NPM packages

Bash

npm install
Set up your environment variables. Create a .env.local file at the root of the project and add the necessary API keys and database connection string. You can use .env.example as a template:

Code snippet

# Neon PostgreSQL Database
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING="..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Other API Keys (Inngest, YouTube, AI Models, etc.)
INNGEST_EVENT_KEY="..."
YOUTUBE_API_KEY="..."
OPENROUTER_API_KEY="..."
REPLICATE_API_KEY="..."
BRIGHTDATA_API_KEY="..."
IMAGEKIT_PUBLIC_KEY="..."
IMAGEKIT_PRIVATE_KEY="..."
IMAGEKIT_URLENDPOINT="..."
Push the database schema to your Neon database using Drizzle Kit:

Bash

npm run db:push
Running the Development Server
Start the development server on http://localhost:3000:

Bash

npm run dev
⚙️ How It Works
CreatorPilot's architecture is designed for a modern, serverless environment.

Frontend: The Next.js/React frontend captures user input and makes API calls to its own backend.

API Routes: Next.js API routes handle incoming requests. For quick tasks, they query the database directly. For long-running AI tasks, they offload the job to Inngest.

Inngest (Background Jobs): Inngest runs complex, multi-step workflows in the background (e.g., calling an AI model, uploading an image, saving to the DB). This ensures the user interface remains fast and responsive.

Database: Drizzle ORM provides a type-safe way to interact with the PostgreSQL database, where all user data and generated content are stored.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
