import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

export default function LongPoll(props:any) {
    const longPollStyle = {
        border: '1px solid black',
        position: 'absolute',
        top: '20px',
        justifySelf: 'center',
        fontSize: '2em'
    } as React.CSSProperties;

    return <div style={longPollStyle}>hello</div>
}