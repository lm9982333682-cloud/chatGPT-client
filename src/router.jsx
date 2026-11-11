import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import MainLayout from './layout/MainLayout.jsx';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

// React Router Data Router: route objects + RouterProvider
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },






      {
        path: '/chat',
        element: <Chat />
      },
      {
        path: '/history',
        element: <History />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '*',
        element: <Home />
      },

    ]

  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  }

]);
