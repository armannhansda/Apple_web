import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Highlight from './components/Highlight'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className=''>
      <Navbar />
      <Hero />
      <Highlight />
    </main>
  )
}

export default App
