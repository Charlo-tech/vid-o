import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import { SocketContext } from '../SocketContext';
 const Notifications = () =>{
     const { answerCall, CallAccepted, call }= useContext(SocketContext);
     return(
         <>
         {call.isReceivedCall && !CallAccepted &&(
             <div style={{display: 'flex', justifyContent: 'center'}}>
                 <h1>{call.name} is calling</h1>
                 <button variant="contained" color="primary" onClick={answerCall}>
                    Receive
                 </button>
             </div>
         )}  
         </>
     )
 }

 export default Notifications;