import { useState } from 'react'
import { SocketProviders } from './providers/Socket'
import { PeerProviders } from './providers/Peer'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import RoomPage from './pages/Room'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <SocketProviders>
        <PeerProviders>
         <Routes>
          <Route path='/' element={<Home />} />   
          <Route path='/room/:roomId' element={<RoomPage/>} />  
        </Routes>
        </PeerProviders>
        
         </SocketProviders>
    </div>
  )
}

export default App
