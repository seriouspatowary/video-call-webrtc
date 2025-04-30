import React, { useEffect, useState ,useCallback} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../providers/Socket'

const Home = () => {

  const { socket } = useSocket();
  
  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();


  const handleJoined = useCallback(({ roomId }) => {
    navigate(`room/${roomId}`)
  },[navigate])
   

  useEffect(() => {
    socket.on('joined-particular-room', handleJoined);

    return () => {
          socket.off('joined-particular-room', handleJoined);

    }
  },[socket,handleJoined])
  
 const handleRoomjoin = () => {
        socket.emit("join-room",{emailId:email, roomId})
  }


  return (
      <div className="homepage-container">
          <div className='input-container'>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Enter Your Email' />
              <input value={roomId} onChange={(e)=>setRoomId(e.target.value)} type="text" placeholder='Enter Your RoomID' />
              <button onClick={handleRoomjoin}>Enter Room</button>
          </div>
          
    </div>
  )
}

export default Home