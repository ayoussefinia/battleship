import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

export default function SwitchTurnPoll(props: any){ 
    const GET_TURN_SWITCH= gql`
    query($payload: CoordinateAsker) {
        getTurnSwitch(payload: $payload) {
            turn
            turnCount
        }
    }
    `
    console.log('******SwitchTurnPollCalled********')
    const coordinateAsker = {
        gameId: props.gameState.gameId,
        uuid: props.gameState.uuid
    }
    const { loading, error, data, startPolling, stopPolling} = useQuery(GET_TURN_SWITCH, {
        variables: { payload: coordinateAsker},
        pollInterval: 30000
    })

    if(data != undefined && data!= null) {
        if(data.getTurnSwitch.turn !=null) {
            if(props.gameState.turn != data.getTurnSwitch.turn && props.gameState.turnCount != data.getTurnSwitch.turnCounte) {
                props.updateState(data.getTurnSwitch.turn, data.getTurnSwitch.turnCount);
            }
        }
    }

    // if (props.gameState.switchingTurn) {
    //     startPolling(5000)
    // }
    // if (props.gameState.switchingTurn = false) {
    //     stopPolling()
    // }
    return null
}