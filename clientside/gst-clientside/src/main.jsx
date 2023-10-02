import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import HomePage from './components/homepage/index.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AddClient from './components/addclient/index.jsx'
import Login from './components/login/index.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>
      },
      {
        path: "newclient",
        element: <AddClient></AddClient>
      }
    ]
  },
  {
    path: '/login',
    element: <Login></Login>
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)
