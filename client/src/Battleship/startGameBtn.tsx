import React from 'react'
import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function StartGameBtn(props: any) {

    return (
        <div className='centerWrapper'>
            <CSSTransition in={props.gameState.battleShipsPlaced && props.gameState.carrierPlaced && props.gameState.destroyerPlaced}
                timeout={1000} mountOnEnter={true} unmountOnExit={true} classNames="fade">
                <>
                    <div className='startGameBtn' onClick={props.startGame}>Start Game</div>
                </>
            </CSSTransition>
        </div>)
}