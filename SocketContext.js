import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('https://videocall-charl.herokuapp.com/');

const ContextProvider =({ children }) =>{
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({ });
    const [CallAccepted, setCallAccepted] = useState(false);
    const [CallEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');


    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({ video: true, audio:true })
            .then((currentStream) =>{
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            });

        socket.on('me', (id) => setMe(id));
        socket.on('CallUser', ({ from, name: callerName, signal}) =>{
            setCall({ isReceivedCall: true, from, name: callerName, signal});
        });
    }, []);

    const answerCall = () =>{
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) =>{
            signal.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) =>{
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) =>{
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) =>{
            signal.emit('CallUser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) =>{
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callAccepted', (signal) =>{
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;

    }

    const leaveCall = () =>{
        setCallEnded(true);
        connectionRef.current.destroy();

        window.location.reload();

    }

    return(
        <SocketContext.Provider value={{
            call,
            CallAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            CallEnded,
            me,
            callUser,
            answerCall,
            leaveCall,
        }}>
    {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext};