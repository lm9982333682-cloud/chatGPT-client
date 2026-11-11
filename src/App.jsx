import React from 'react'
import useAuthMe from './hooks/useAuthMe'
import { RouterProvider } from 'react-router';
import { router } from './router';

const App = () => {
    useAuthMe()

    return <RouterProvider router={router} />
}

export default App
