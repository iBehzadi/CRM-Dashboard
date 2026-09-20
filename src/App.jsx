import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/router'

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}
