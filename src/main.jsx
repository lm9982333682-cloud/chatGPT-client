import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>

            <App />
            <ToastContainer />
        </Provider>

    </React.StrictMode>
);
