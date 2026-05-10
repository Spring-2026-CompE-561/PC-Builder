- node.js needs to be installed https://nodejs.org/en/download
- to check if node.js is installed run node -v and npm -v in terminal, should output version
- npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
- ShadCN UI - Lyra Preset (JetBrains Mono + Phosphor Icons)
- npm install lucide-react

.env.local in frontend/
NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
http://localhost:3000/


Cybersecurity Features:
Rate Limiting - Currently times you out for 30 seconds after 3 failed attempts. This can be easily expanded on.
