import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Model from './components/Model'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className=''>
      <Navbar />
      <Hero />
      <Highlight />
      <Model />
    </main>
  )
}

export default App
