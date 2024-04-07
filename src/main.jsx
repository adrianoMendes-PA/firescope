import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx'
import Chart from './pages/chart/index.jsx';
import ErrorPage from './pages/errorPage/index.jsx'
import Mapa from './components/mapa/index.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Mapa />
      },
      {
        path: "chart",
        element: <Chart />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
