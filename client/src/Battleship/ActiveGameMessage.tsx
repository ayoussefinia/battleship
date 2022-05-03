import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

export default function ActiveGameMessage(props:any) {
    const activeGameMessageStyle = {
        border: '1px solid black',
        position: 'absolute',
        top: '20px',
        justifySelf: 'center',
        fontSize: '2em',
        backgroundColor: 'white',
    } as React.CSSProperties;
    // console.log('props.gamestate.turn',props.gameState.turn)
    // console.log('props.gamestate.turn',props.gameState.uuid)

    const GET_OPPOSING_SHOT_COORDINATE= gql`
    query($payload: CoordinateAsker) {
        getOpposingShotCoordinate(payload: $payload) {
            row
            column
        }
    }
    `

    const coordinateAsker = {
        uuid: props.gameState.uuid,
        gameId: props.gameState.gameId
    }



    const { loading, error, data, startPolling, stopPolling} = useQuery(GET_OPPOSING_SHOT_COORDINATE, {
        variables: { payload: coordinateAsker},
        pollInterval: 5000,
        notifyOnNetworkStatusChange: true,
        onCompleted:  ()=> {
            // if(props.gameState.turn ==)
        if(data!= undefined) {
            if (data.getOpposingShotCoordinate.row != null) {
                props.fire(data.getOpposingShotCoordinate.row,data.getOpposingShotCoordinate.column)
                stopPolling();
            }
        }

        //   if(data != undefined && 
        //     data!= null &&
        //     data.getGameId.gameId != 'none' 
        //     && data.getGameId.gameId != 'waitingYou'
        //     && data.getGameId.gameId != 'waitingOther') {
        //     props.setGameState(data.getGameId.gameId, data.getGameId.turn)
        //     stopPolling();
        //   }
        }
      });

      if(error) {
          console.log('get opposing shot error:',error)
      }

    //   const  opponentHit = 'opponent hit your ship'
    //   if(props.gameState.uuid != props.gameState.turn && props.gameState.gameStarted) {
    //     startPolling(5000);
    //   }
      if(props.gameState.uuid == props.gameState.turn || !props.gameState.gameStarted) {
        stopPolling();
      }


      console.log('get opposing shot data called, data:', data, 'coordinate asker:', coordinateAsker);
    if(data!= undefined && data.getOpposingShotCoordinate != null) {
        if(data.getOpposingShotCoordinate.row == null){
            if(props.gameState.turn != '' && props.gameState.uuid != '' && props.gameState.gameStarted) {
                if(props.gameState.turn == props.gameState.uuid) {
                    return <div style={activeGameMessageStyle}>your turn</div>
                }
                if (props.gameState.turn != props.gameState.uuid) {
                    return <div style={activeGameMessageStyle}>their turn</div>
                }
            }
        }
        if(data.getOpposingShotCoordinate.row != null) {
            
            // if(props.gameState.turn == props.gameState.uuid && props.gameState.yourShotHit) {
            //     return <div style={activeGameMessageStyle}>you hit your opponents ship</div>
            // }
            if (props.gameState.turn != props.gameState.uuid && !props.gameState.opponentShotHit) {
                return <div style={activeGameMessageStyle}>opponent missed your ship</div>
            }
            if (props.gameState.turn != props.gameState.uuid && props.gameState.opponentShotHit) {
                return <div style={activeGameMessageStyle}>opponent hit your ship</div>
            }
        }
    }
    return null
}