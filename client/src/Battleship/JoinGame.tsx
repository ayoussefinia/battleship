import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const POST_UUID= gql`
mutation($payload:String!) {
    postUUID(payload: $payload)
}
`

export default function JoinGame() {
        
    const [postUUID, { data, loading, error }] = useMutation(POST_UUID);
    const uuid = uuidv4();
    console.log(uuid)
    console.log('data', data);

    if(data) {
        return(
            <div>{data}</div>
        )
    }
  
    return (
      <div>
         <button onClick={()=>postUUID({variables: {payload: uuid}})}>
            join Game
         </button>
      </div>
    );
  }