import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';


export default function GameStartedMessage(props:any){
    const gameStartedBox= {
        border: '1px solid black',
        fontSize: '2em',
        // position: 'absolute',
        // top: '20px',
        // left: '20px'
        marginLeft:'auto',
        marginRight:'auto',
        padding:'8px',
        backgroundColor: 'white',
    } as React.CSSProperties;
    const GET_GAME_ID= gql`
    query($payload: String!) {
        getGameId(payload: $payload) {
            turn
            gameId
        }
    }
    `
    const { loading, error, data, startPolling, stopPolling} = useQuery(GET_GAME_ID, {
        variables: { payload: props.uuid },
        pollInterval: 5000,
        notifyOnNetworkStatusChange: true,
        onCompleted:  ()=> {
          if(data != undefined && 
            data!= null &&
            data.getGameId.gameId != 'none' 
            && data.getGameId.gameId != 'waitingYou'
            && data.getGameId.gameId != 'waitingOther') {
            props.setGameState(data.getGameId.gameId, data.getGameId.turn)
            stopPolling();
          }
        }
      });

      // if(error) {
      //     console.log('query error:',error);
      // }
      // if(loading) {
      //     console.log('query loading: ', loading)
      // }
      if(data != undefined && data!= null) {
        //   console.log('game data', data)
          if(data.getGameId.gameId == 'none') {
            return <div style={gameStartedBox}>Place your ships them Click "start game"</div>
          }
          if(data.getGameId.gameId == 'waitingOther') {
            return <div style={gameStartedBox}>Waiting for another player to join</div>
          }
          if(data.getGameId.gameId == 'waitingYou') {
            return <div style={gameStartedBox}>Other player waiting on you to place ships and Click "start"</div>
          }
          if(data.getGameId.gameId != 'none' && data.getGameId.gameId != 'waiting') {
              localStorage.setItem("gameId", data.getGameId.gameId);
              console.log('constANTLY CALLED')
              // props.setGameState(data.getGameId.gameId, data.getGameId.turn)
              // console.log('props.gameId:', props.gameState.gameId)
             
              return <div style={gameStartedBox}>GAME ON!!!</div>
              // return <div style={gameStartedBox}>GAME ON!!! gameId: {data.getGameId.gameId}</div>
          }

          

        // if(data.gameId != null) {
        //     return <div style={gameStartedBox}>Game Started</div>
        // }

        // else {
        //     console.log(data)
        // }
      }
      return <div style={gameStartedBox}>Cant connect to server</div>
      
}