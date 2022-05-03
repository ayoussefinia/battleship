import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { start } from 'repl';

export default function ShotResultPoll(props: any){
    const GET_SHOT_RESULT= gql`
    query($payload: CoordinateAsker) {
        getShotResult(payload: $payload) {
            row
            column
            hit
        }
    }
    `
    
    const SWITCH_TURN=gql`
    mutation($payload: CoordinateAsker){
        switchTurn(payload: $payload)
    }`
    const [switchTurn] =useMutation(SWITCH_TURN)
    const coordinateAsker = {
        gameId: props.gameId,
        uuid: props.uuid
    }


    console.log('listening result', props.listentingFireResult)
    console.log('*******shot result poll called ')
    const { loading, error, data, startPolling, stopPolling} = useQuery(GET_SHOT_RESULT, {
        variables: { payload: coordinateAsker},
        pollInterval: 5000,
        onCompleted: () => {

            if (props.listentingFireResult != false) {
                // console.log('stop polling no longer listening fire restult')
                startPolling(5000)
            }
        
            console.log('shot result poll data: ', data)
            if(data != undefined && data!= null) {
                if(data.getShotResult.hit !=null) {
                    console.log('inside switching turn iff')
                    props.resultFire(data.getShotResult.row,data.getShotResult.column,data.getShotResult.hit);
                    const variables= {variables: {payload: coordinateAsker}};
                    // switchTurn(variables);
                    props.updateState();
                    stopPolling()
                }
            }
        }
    })


    if(error) {
        console.log('shot result poll error:', error)
    }







    return null
}