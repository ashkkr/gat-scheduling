import { useState } from 'react'
import './App.css'
import HomePage, { ClientEditables } from './components/homepage/Index'
import AddClient from './components/addclient'
import { Link, Outlet } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Spinner from 'react-bootstrap/Spinner'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <RecoilRoot>
      <div>
        <ClientNavBar></ClientNavBar>
        <Outlet></Outlet>
      </div>
    </RecoilRoot>
  )
}

function ClientNavBar() {
  return <div class="clientnavbar">
    <h1>
      Client Management
    </h1>
    <div class="navbar-btns">
      <Link to={`newclient`}>
        <button >Add Client</button>
      </Link>
      <button>Logout</button>
    </div>
  </div>
}


export default App
