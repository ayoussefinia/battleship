import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

export default function ShotResultPoll(){
    const GET_SHOT_RESULT= gql`
    query($payload: ShotResult) {
        getShotResult(payload: $payload) {
            row
            column
        }
    }
    `
}