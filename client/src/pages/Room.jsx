import React, { useEffect, useCallback, useRef,useState } from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';
import ReactPlayer from 'react-player'

const RoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns , sendStream,remoteStream} = usePeer();
    const [mystream ,SetMystream] = useState(null)
    const [remoteEmailId, setRemoteEmailId] = useState(null)

    const handlenewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("new user join the room", emailId);
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });
        setRemoteEmailId(emailId);
    }, [createOffer, socket]);



    const handleIncoming = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("incoming call from", from, offer);
        const ans = await createAnswer(offer); 
        socket.emit("call-accepted", { emailId: from, ans });
        setRemoteEmailId(from)
    }, [createAnswer, socket]);




    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        console.log("Call Accepted:", ans);
        await setRemoteAns(ans);
    }, [setRemoteAns]);



    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        sendStream(stream);
        SetMystream(stream)
        
    },[])

    useEffect(() => {
      
            socket.on('user-joined', handlenewUserJoined);
            socket.on('incoming-call', handleIncoming);
            socket.on('call-accepted', handleCallAccepted);
    

        return () => {
            socket.off('user-joined', handlenewUserJoined);
            socket.off('incoming-call', handleIncoming);
            socket.off('call-accepted', handleCallAccepted);
         };


    }, [handleIncoming, handlenewUserJoined, handleCallAccepted, socket]);




    useEffect(() => {
       getUserMediaStream()

    }, [getUserMediaStream]);


    return (
        <div className="room-page-containet">
            <h1>room page</h1>
            <h4>You are connected to { remoteEmailId}</h4>
            <ReactPlayer url={mystream} playing muted/>
            <ReactPlayer url={remoteStream} playing/>

        </div>
    );
}

export default RoomPage;
