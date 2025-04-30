import React, { useMemo } from "react";
import { io } from 'socket.io-client';

const PeerContext = React.createContext(null);

export const usePeer = ()=> React.useContext(PeerContext)

export const PeerProviders = (props) => {

    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ]
    }), [])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer);
        return offer;
    }

  
    const createAnswer = async (offer) => {
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            return answer;
};


    const setRemoteAns = async (ans) => {
      
            await peer.setRemoteDescription(ans);
    };

    const sendStream = async (stream) => {
        const tracks = stream.getTracks();
        for (const track of tracks) {
            peer.addTrack(track,stream)
        }
    }


    return (
        <PeerContext.Provider value={{peer,createOffer,createAnswer,setRemoteAns, sendStream}}>
            {props.children}
        </PeerContext.Provider>
    )
}