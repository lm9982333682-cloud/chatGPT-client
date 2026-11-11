# Nova AI Chat UI (React + Vite + Tailwind CSS)

Component-based frontend based on the supplied Nova AI reference screens.

## Stack
- React + Vite
- Tailwind CSS v4 (Vite plugin)
- React Router **Data Router** using `createBrowserRouter` and `RouterProvider`
- lucide-react icons

## Structure
```text
src/
├── components/
│   ├── chat/       # Composer, message bubbles, prompt suggestions
│   ├── history/    # History session cards
│   ├── layout/     # Responsive sidebar, topbar, main layout
│   └── settings/   # Reusable settings panel
├── data/           # Static demo data
├── pages/          # Home, Chat, History, Settings
├── index.css
├── main.jsx
└── router.jsx      # Data Router configuration
```

## Run
```bash
npm install
npm run dev
```

## Notes
This is a frontend-only project. The chat reply is a local demo response; no backend or AI API is called. The sidebar slides in on mobile via the menu button and stays visible on desktop. Settings controls and history filtering/export are interactive.
