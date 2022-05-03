import React, {useRef, useEffect, useState, MouseEvent} from 'react';
import battleshipImage from './battleship.svg';
import carrierImage from './carrier.svg';
import destroyerImage from './destroyer.svg'
import { v4 as uuidv4 } from 'uuid';
// import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  _ from 'lodash'
import { faArrowUp, faArrowLeft, faArrowRight, faArrowDown, faRotateLeft, faRotateRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { gql, useMutation, useQuery } from '@apollo/client';
import  JoinGame  from './JoinGame'
// import { DEFAULT_MIN_VERSION } from 'tls';
import GameStartedMessage from './GameStartedMessage';
import ActiveGameMessage from './ActiveGameMessage';
import { Transition, CSSTransition } from 'react-transition-group';
import { ENTERED, ENTERING } from 'react-transition-group/Transition';


export default  function BattleShip() {
    const [gameState, setGameState] = useState({
                                    grid: [
                                        [{row:0,column:0,hit:false,firedAt:false}]
                                    ],
                                    opponentGrid: [
                                        [{row:0,column:0,hit:false,firedAt:false}]
                                    ],
                                    battleShip: [
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}},
                                                 {hit:false, pos:{x:0, y:0}}
                                                ],
                                    carrier :   [
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}}
                                                ],
                                    destroyer:  [
                                                {hit:false, pos:{x:0, y:0}},
                                                {hit:false, pos:{x:0, y:0}},
                                    ],
                                    gameGrid:[[]],
                                    battleShipsPlaced: false,
                                    carrierPlaced: false,
                                    destroyerPlaced: false, 
                                    placingBattleShip: false,
                                    placingCarrier: false,
                                    placingDestroyer: false,
                                    manipulatingBattleShip: false,
                                    battleShipVertical: false,
                                    carrierVertical: false,
                                    destroyerVertical:false,
                                    gameStarted: false,
                                    gameStartedBackend: false,
                                    uuid: '' ,
                                    gameId: '',
                                    turn: '',
                                    opponentShotHit:false
                                    });
    let [selectedShip, setSelectedShip] = useState("");
 
    // const POST_GAME_ARRAY = gql`
     useEffect(()=>{
   
        let gameGrid = Array(numGridEdge).fill(null).map(row => new Array(numGridEdge).fill(null))
        for(var i =0; i<numGridEdge;i++){
            for(var j=0; j<numGridEdge; j++){
                let  obj={column:0, row:0, hit:false, firedAt:false}
                obj.row = i;
                obj.column=j
                gameGrid[i][j] = obj
            }
        }


        if(!localStorage.getItem("uuid")) {
            const uuid = uuidv4();
            localStorage.setItem("uuid", uuid)
        }

        const uuid = JSON.stringify(localStorage.getItem("uuid"))

        setGameState({...gameState, grid: gameGrid, opponentGrid: gameGrid, uuid: uuid});
        // postGameArray({ variables: { payload: 'hello'} });
        // postGameArray({ variables: { payload: 'hello'} });
    //    MyComponent();
        
        console.log('gameState uuid',gameState.uuid)
    },[])

    const POST_GAME_ARRAY= gql`
    mutation($payload:PostGrid!) {
        postGameArray(payload: $payload)
    }
    `

    const POST_UUID= gql`
    mutation($payload:String!) {
        postUUID(payload: $payload)
    }
    `
    const POST_FIRE_AT_OPPONENT =gql`
    mutation($payload: FireCoordinate!) {
        postFireAtOpponent(payload: $payload)
    }
    `

    const GET_GAME_ID= gql`
    query($payload: String!) {
        getGameId(payload: $payload)
    }
    `
    // const hello = {'hello': "hello"} 
    const send = ()=> {
      
    }


    // const [postUUID, { data, loading, error }] = useMutation(POST_UUID);
    // console.log('post uuid data:', data);
    // // Pass mutation to useMutation
    const [postUUID] = useMutation(POST_UUID);
    const [postGameArray] = useMutation(POST_GAME_ARRAY);
    const [postFireAtOpponent] = useMutation(POST_FIRE_AT_OPPONENT);

    // const GameStartedMessage = ()=> {
    //     const { loading, error, data } = useQuery(GET_GAME_ID, {
    //         variables: { payload: gameState.uuid },
    //         pollInterval: 5000,
    //         notifyOnNetworkStatusChange: true
    //       });

    //       if(error) {
    //           console.log('query error:',error);
    //       }
    //       if(loading) {
    //           console.log('query loading: ', loading)
    //       }
    //       if(data != null) {
    //           console.log('game data', data)
    //         // if(data.gameId != null) {
    //         //     return <div style={gameStartedBox}>Game Started</div>
    //         // }
  
    //         // else {
    //         //     console.log(data)
    //         // }
    //       }
    //       return <div style={gameStartedBox}>Waiting for Another Player to Join</div>
    // }

    
    // console.log(data)
   



    const numGridEdge =8;
    const gridEdgeLength= 336;
    const delta = (gridEdgeLength)/numGridEdge;
    const carrierLength = 5;
    const destroyerLength = 2;
    
    // const containerStyles = {
    //     height: window.innerHeight,
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems:'center',
    
    // }

    const gameGridStyles = {
        // width: window.innerHeight *.75,
        // height: window.innerHeight * .75,
        height: '336px',
        width: '336px',
        border: '1px solid red  ',
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        position: 'relative',
        // position:'absolute',
        // top: '100px',
        marginLeft: 'auto',
        marginRight: 'auto'
        // transform: `translateX(${delta*2.5}px)`
    } as React.CSSProperties;

    let [gameGridCursor, setGameGridCursor] = useState({
        cursor: 'auto'
    })

    let [firstClickedShips, setFirstClickedShips] = useState({carrier: true, battleship: true, destroyer: true})

    const gridElementStyles = {
        width: '100%',
        height: '100%',
        border: '1px solid black',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr'
    }

    const shipYardStyles = {
        // width: window.innerHeight*.75 * (5/8),
        width: '225px',
        height: window.innerHeight*.75 * (3/8),
        position: 'relative',
        margin:'auto',
        border: '1px solid black',

    } as React.CSSProperties;

    const battleshipStyle = {
        // width: window.innerHeight*.75 * (4/8),
        // height: window.innerHeight*.75 * (3/8) /3 ,
        width: '164px',
        height: '40px',
        gridRowStart: 1,
        gridColumnStart: 1,
        backgroundImage: `url(${battleshipImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
    }

    const gridBattleShipStyle = {
        position: 'absolute',
        top: gameState.battleShipVertical? (gameState.battleShip[0].pos.y * delta - delta) + 5 :  (gameState.battleShip[0].pos.y * delta) + 2,
        left: gameState.battleShipVertical? (gameState.battleShip[0].pos.x*delta) + 2 : (gameState.battleShip[0].pos.x*delta) + 3,
        // width: window.innerHeight*.75 * (4/8),
        // height: window.innerHeight*.75 * (3/8) /3 ,
        width: '164px',
        height: '40px',
        backgroundImage: `url(${battleshipImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        // backgroundSize: '100% 60%',
        transform: `rotate(${gameState.battleShipVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0,
        cursor: 'pointer'
    } as React.CSSProperties;

    const gridCarrierStyle = {
        position: 'absolute',
        top: gameState.carrierVertical? (gameState.carrier[0].pos.y * delta - delta) + 5:  (gameState.carrier[0].pos.y * delta) + 2,
        left: gameState.carrierVertical? (gameState.carrier[0].pos.x*delta) + 2: (gameState.carrier[0].pos.x*delta) + 3,
        // width: window.innerHeight*.75 * (5/8),
        // height: window.innerHeight*.75 /8,
        width: '206px',
        height: '40px',

        backgroundImage: `url(${carrierImage})`,
        // backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        transform: `rotate(${gameState.carrierVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0,
        cursor: 'pointer',
    } as React.CSSProperties;

    const gridDestroyerStyle = {
        position: 'absolute',
        top: gameState.destroyerVertical? (gameState.destroyer[0].pos.y * delta - delta) + 5 :  (gameState.destroyer[0].pos.y * delta) + 2,
        left: gameState.destroyerVertical? (gameState.destroyer[0].pos.x*delta) + 2: (gameState.destroyer[0].pos.x*delta) + 3,
        // width: window.innerHeight*.75 * (destroyerLength/numGridEdge),
        // height: window.innerHeight*.75/numGridEdge,
        width: '80px',
        height: '40px',
        backgroundImage: `url(${destroyerImage})`,
        // backgroundSize: '100% 60%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: `rotate(${gameState.destroyerVertical? 90 : 0}deg) `,
        transformOrigin:'0% 100%',
        zIndex: gameState.gameStarted? -1 : 0,
        cursor: 'pointer'
    } as React.CSSProperties;


    const carrierStyle = {
        // width: window.innerHeight*.75 * (5/8),
        // height: window.innerHeight*.75 * (3/8) /3 ,
        width: '206px',
        height: '40px',
        gridRowStart: 2,
        gridColumnStart: 1,
        backgroundImage: `url(${carrierImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
    }
    const destroyerStyle = {
        // width: window.innerHeight*.75 * (2/8),
        // height: window.innerHeight*.75 * (3/8) /3 ,
        width: '80px',
        height: '40px',
        gridRowStart: 3,
        gridColumnStart: 1,
        backgroundImage: `url(${destroyerImage})`,
        // backgroundSize: '100% 60%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
    }

    const shipDefaultStyle = {
        background: 'black',
        width: '38px',
        height: '38px',
        marginRight: '3px',
        borderRadius: '10px',
        cursor:'pointer',
        border: ''
      }
    const shipSelectedStyle = {
        background: 'black',
        width: '38px',
        height: '38px',
        marginRight: '3px',
        borderRadius: '10px',
        cursor:'pointer',
        border: '3px solid white'
      }
    
    let [selectCarrierStyle, setSelectCarrierStyle] = useState(shipDefaultStyle)
    let [selectBattleshipStyle, setSelectBattleshipStyle] = useState(shipDefaultStyle)
    let [selectDestroyerStyle, setSelectDestroyerStyle] = useState(shipDefaultStyle)

    const arrowUpContainer = {
        height: '20%',
        width: '100%',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const arrowLeftContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const arrowRightContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const leftAndRightContainer ={
        display: 'flex',
        width: '100%'
    }
    const arrowDownContainer = {
        height: '20%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateLeftAndRightContainer = {
        height: '25%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateLeftContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    const rotateRightContainer = {
        height: '100%',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const arrowStyles = {
        cursor: 'pointer'
    }
    const buttonPanelContainer = {
        display: 'flex',
    }
    const hitStyles={
        background: 'rgba(255, 34, 34, 0.5)'
    }
    const missedStyles= {
        background: 'rgba(34, 41, 255, 0.5)'
    }
    const gameStartedBox= {
        border: '1px solid black',
        fontSize: '2em'
    }

    // animations
    let [inProp, setInProp] = useState(false);
    const duration = 300;

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        }

    const transitionStyles = {
        entering: { opacity: 1 },
        entered:  { opacity: 1 },
        exiting:  { opacity: 0 },
        exited:  { opacity: 0 },
    };

    function handleBattleShipClick(e: MouseEvent) {
        setGameState({...gameState, placingBattleShip:true, placingCarrier:false});
        setSelectedShip("battleship")
        hilightBattleship()
    }
    function handleDestroyerClick () {
        setGameState({...gameState, placingDestroyer:true, placingBattleShip:false, placingCarrier:false});
        setSelectedShip("destroyer")
        highlightDestroyer()
    }
    function handleCarrierClick (){
        setGameState({...gameState, placingCarrier:true, placingBattleShip:false});
        setSelectedShip("carrier")
        highlightCarrier()
    }
    function handleGridCarrierClick () {
        setGameState({...gameState, placingBattleShip:false, placingCarrier:true, placingDestroyer:false});
        highlightCarrier()
    }
    function handleGridBattleShipClick () {
        setGameState({...gameState, placingBattleShip:true, placingCarrier:false, placingDestroyer:false});
        hilightBattleship()
    }
    function handleGridDestroyerClick () {
        setGameState({...gameState, placingDestroyer:true, placingCarrier:false, placingBattleShip:false});
        highlightDestroyer()
    }

    function highlightCarrier(){
        setSelectCarrierStyle(shipSelectedStyle)
        setSelectBattleshipStyle(shipDefaultStyle)
        setSelectDestroyerStyle(shipDefaultStyle)
    }
    function highlightDestroyer(){
        setSelectCarrierStyle(shipDefaultStyle)
        setSelectBattleshipStyle(shipDefaultStyle)
        setSelectDestroyerStyle(shipSelectedStyle)
    }
    function hilightBattleship(){
        setSelectCarrierStyle(shipDefaultStyle)
        setSelectBattleshipStyle(shipSelectedStyle)
        setSelectDestroyerStyle(shipDefaultStyle)
    }

    function handleShipPlacement(ship:string, rowIndex:any, colIndex: any) {
        let gridX = colIndex;
        let gridY = rowIndex; 
        console.log("gridX:",gridX, "gridY:", gridY)
        
        // initialize half ship width & height
        let rightShip = 0;
        let leftShip = 0
        let upShip = 0;
        let downShip = 0;
        // let halfShipHeight=delta/2;
        let halfShipHeight = 20;
        let vert = false;
        switch (ship) {
            case 'battleship': leftShip = 2, rightShip = 2, upShip = 0, downShip = 4,  vert = gameState.battleShipVertical;
                break;
            case 'carrier' : leftShip = 3, rightShip = 2, upShip = 0, downShip = 5, vert = gameState.carrierVertical;
                break
            case 'destroyer' : leftShip = 1, rightShip = 1, upShip = 0, downShip = 2, vert = gameState.destroyerVertical;
                break
        }
        if (!vert){
            if((gridX - leftShip >= 0 && gridX + rightShip < 9)    &&
                (gridX >= 0 && gridX < 9) && 
                (gridY >= 0 && gridY < 9)) { 

                    //check conflicts then place
                    placeShip(ship, gridX, gridY)
                }
        }else{
            if((gridY - upShip >= 0 && gridY + downShip < 9)&&
                (gridX >= 0 && gridX < 9) && 
                (gridY >= 0 && gridY < 9))
                {
                    //check conflicts then place
                    placeShip(ship, gridX, gridY)
                }
        }
    }

    function placeShip(ship: any, gridX:any, gridY:any){
        setGameGridCursor({cursor: 'auto'})
        if(ship == 'battleship') {
            const battleShip = [...gameState.battleShip];
            for(var i=0; i<battleShip.length; i++) {
                //fill in position coordinates
                battleShip[i].pos.x = gridX - 2 + i;
                battleShip[i].pos.y = gridY;
            }
            setGameState({...gameState, battleShipsPlaced:true, battleShip:battleShip})
       } else if(ship == 'carrier') {
            const carrier = [...gameState.carrier];
            for(var i=0; i<carrier.length; i++) {
                carrier[i].pos.x = gridX - 3+i;
                carrier[i].pos.y = gridY;
            }
            setGameState({...gameState, carrierPlaced:true, carrier:carrier})
            // console.log(gameState.carrier)
       } else if (ship == 'destroyer') {
            const destroyer = [...gameState.destroyer];
            for(var i=0; i<destroyer.length; i++) {
                destroyer[i].pos.x = gridX - 1+i;
                destroyer[i].pos.y = gridY;
            }
            setGameState({...gameState, destroyerPlaced:true, destroyer:destroyer})
            console.log(gameState.destroyer);
       }

   }

    function setManipulateTrue() {
        setGameState({...gameState, manipulatingBattleShip: true});
    }

    function checkConflicts(newShip:any, shipType:string) {
        
        let battleDestroyerConflict = false;
        let battleCarrierConflict = false; 
        let destroyerCarrierConflict =false;
        let carrier = gameState.carrier;
        let battleShip= gameState.battleShip;
        let destroyer = gameState.destroyer;
        if(shipType=='carrier') {
            carrier=newShip;
        } else if (shipType=='destroyer'){
            destroyer=newShip
        } else {battleShip=newShip}

        let carrierStringArray=[];
        let destroyerStringArray=[];
        let battleShipStringArray=[];
        for(let i=0;i<carrier.length;i++){carrierStringArray.push(JSON.stringify(carrier[i].pos))}
        for(let i=0;i<destroyer.length;i++){destroyerStringArray.push(JSON.stringify(destroyer[i].pos))}
        for(let i=0;i<battleShip.length;i++){battleShipStringArray.push(JSON.stringify(battleShip[i].pos))}
       
        for(let i=0;i<carrier.length;i++){
            if(_.includes(destroyerStringArray, carrierStringArray[i]) && 
            gameState.carrierPlaced==true && gameState.destroyerPlaced==true){
                destroyerCarrierConflict =true;
            } else if(_.includes(battleShipStringArray, carrierStringArray[i]) &&
            gameState.carrierPlaced==true && gameState.battleShipsPlaced==true
            ){
                battleCarrierConflict = true;
            }
        }

        for(let i=0;i<battleShip.length;i++){
            if(_.includes(destroyerStringArray, battleShipStringArray[i]) &&
            gameState.battleShipsPlaced==true && gameState.destroyerPlaced==true
            ) {
                battleDestroyerConflict = true;
            }
        }

        console.log(destroyerStringArray)
        for(var i=0 ; i<carrier.length;i++){
    

            console.log('conflicts',battleDestroyerConflict,battleCarrierConflict,destroyerCarrierConflict)
            if(battleDestroyerConflict==true||battleCarrierConflict==true
                ||destroyerCarrierConflict==true ) {
                    return true
                }
            return false;
        }
    }

    function moveShipUp() {
        if(gameState.placingBattleShip){
            const battleShip = _.cloneDeep(gameState.battleShip);


            if(battleShip[0].pos.y > 0) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.y = battleShip[i].pos.y -1;
                }
                const conflict = checkConflicts(battleShip,'battleship');
                if(conflict !=true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
                
            }
        } else if (gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[0].pos.y > 0) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.y = carrier[i].pos.y -1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict !=true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[0].pos.y > 0) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.y = destroyer[i].pos.y -1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict!= true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }
    }

    function moveShipLeft() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[0].pos.x > 0) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.x = battleShip[i].pos.x -1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict!= true) {
                   setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[0].pos.x > 0) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.x = carrier[i].pos.x -1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict!= true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if(gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[0].pos.x > 0) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.x = destroyer[i].pos.x -1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict!= true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }
    }

    function moveShipRight() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[battleShip.length-1].pos.x < 7) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.x = battleShip[i].pos.x +1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict!= true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[carrier.length-1].pos.x < 7) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.x = carrier[i].pos.x +1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict!= true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if(gameState.placingDestroyer) {

            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[destroyer.length-1].pos.x < numGridEdge-1) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.x = destroyer[i].pos.x +1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict != true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        } 
    }

    function moveShipDown() {
        if(gameState.placingBattleShip) {
            const battleShip = _.cloneDeep(gameState.battleShip)
            if(battleShip[battleShip.length-1].pos.y < 7) {
                for(var i = 0; i <battleShip.length; i++) {
                    battleShip[i].pos.y = battleShip[i].pos.y + 1;
                }
                const conflict = checkConflicts(battleShip,'battleShip');
                if(conflict != true) {
                    setGameState({...gameState, battleShip: battleShip});
                }
            }
        } else if(gameState.placingCarrier) {
            const carrier = _.cloneDeep(gameState.carrier)
            if(carrier[carrier.length-1].pos.y < 7) {
                for(var i = 0; i <carrier.length; i++) {
                    carrier[i].pos.y = carrier[i].pos.y + 1;
                }
                const conflict = checkConflicts(carrier,'carrier');
                if(conflict != true) {
                    setGameState({...gameState, carrier: carrier});
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = _.cloneDeep(gameState.destroyer)
            if(destroyer[destroyer.length-1].pos.y < 7) {
                for(var i = 0; i <destroyer.length; i++) {
                    destroyer[i].pos.y = destroyer[i].pos.y + 1;
                }
                const conflict = checkConflicts(destroyer,'destroyer');
                if(conflict != true) {
                    setGameState({...gameState, destroyer: destroyer});
                }
            }
        }

    }
    function rotateShip() {
        if(gameState.placingBattleShip) {
            const battleShip = gameState.battleShip
            const newBattleShip = _.cloneDeep(battleShip);
            if(!gameState.battleShipVertical){
                if(numGridEdge-2 >  battleShip[0].pos.y  && battleShip[0].pos.y > 0 ) {
                    for(var i = 0; i <battleShip.length; i++) {
                        newBattleShip[i].pos.y = battleShip[2].pos.y - 1 +i;
                        newBattleShip[i].pos.x = battleShip[2].pos.x -1;
                    }
                    const conflict = checkConflicts(newBattleShip,'battleShip');
                    if(conflict != true) {
                        setGameState({...gameState, battleShip: newBattleShip, battleShipVertical:true});
                    }
                }
            } 
            else {
                if(battleShip[0].pos.x >0 && battleShip[0].pos.x <numGridEdge-2) {
                    for(var i = 0; i <battleShip.length; i++) {
                        newBattleShip[i].pos.y = battleShip[2].pos.y - 1;
                        newBattleShip[i].pos.x = battleShip[2].pos.x - 1 +i;
                    }
                    const conflict = checkConflicts(newBattleShip,'battleShip');
                    if(conflict != true) {
                        setGameState({...gameState, battleShip: newBattleShip, battleShipVertical:false});
                    }
                }
            }
    
        } else if (gameState.placingCarrier) {
            const carrier = gameState.carrier;
            const newCarrier = _.cloneDeep(carrier);
            if(!gameState.carrierVertical){
                if(numGridEdge-2 >  carrier[0].pos.y  && carrier[0].pos.y > 1 ) {
                    for(var i = 0; i <carrier.length; i++) {
                        newCarrier[i].pos.y = carrier[2].pos.y -2 +i;
                        newCarrier[i].pos.x = carrier[2].pos.x ;
                    }
                    const conflict = checkConflicts(newCarrier,'carrier');
                    if(conflict != true) {
                        setGameState({...gameState, carrier: newCarrier, carrierVertical:true});
                    }
                }
            } 
            else {
                if(carrier[0].pos.x >1 && carrier[0].pos.x <numGridEdge-2) {
                    for(var i = 0; i <carrier.length; i++) {
                        newCarrier[i].pos.y = newCarrier[2].pos.y ;
                        newCarrier[i].pos.x = newCarrier[2].pos.x - 2 +i;
                    }
                    const conflict = checkConflicts(newCarrier,'carrier');
                    if(conflict != true) {
                        setGameState({...gameState, carrier: newCarrier, carrierVertical:false});
                    }
                }
            }
        } else if (gameState.placingDestroyer) {
            const destroyer = gameState.destroyer;
            const newDestroyer = _.cloneDeep(destroyer);
            if(!gameState.destroyerVertical){
         
                if(numGridEdge-1 >  destroyer[0].pos.y) {

                    for(var i = 0; i <destroyer.length; i++) {
                        newDestroyer[i].pos.y = destroyer[1].pos.y +i;
                        newDestroyer[i].pos.x = destroyer[0].pos.x ;
                    }

                    const conflict = checkConflicts(newDestroyer,'destroyer');
                    if(conflict != true) {
                        setGameState({...gameState, destroyer: newDestroyer, destroyerVertical:true});
                    }
                }
            } 
            else {
                
                if(destroyer[0].pos.x <numGridEdge-1) {
                    for(var i = 0; i <destroyer.length; i++) {
                        newDestroyer[i].pos.y = newDestroyer[0].pos.y ;
                        newDestroyer[i].pos.x = newDestroyer[0].pos.x +i;
                    }
                    const conflict = checkConflicts(newDestroyer,'destroyer');
                    if(conflict != true) {
                        setGameState({...gameState, destroyer: newDestroyer, destroyerVertical:false});
                    }
                }
            }

        }

    }

    async function startGame() {
        const element = {
            row: 0,
            column:0,
            hit: true,
            firedAt: true
        }
        let obj2 = {data: [{}]}
        for(var i=0; i<numGridEdge; i++) {
            let obj1 ={data: [{}]};
            obj1.data = gameState.grid[i]
            obj2.data.push(obj1) ;
        }
        obj2.data.shift();

        let postObject = {
            grid: obj2,
            uuid: gameState.uuid,
            gameId: gameState.gameId
        }
        console.log('post object', postObject)
        // consol.log(obj2)
        // const arr2 =[arr1]
        // const uuid = uuidv4();
        // console.log('uuid:', JSON.stringify(uuid))
        // postUUID({variables: {payload: uuid}});
        // }
        await postUUID({variables: {payload: gameState.uuid}})
        await postGameArray({
            variables: {payload: postObject}
        })
        setGameState({...gameState, gameStarted: true})
        
    }

    function fire(row:any, col:any) {
        let opponentShotHit= false;
        console.log('fired')
        const newGrid = gameState.grid;
        let newObj = {row:row, column:col, firedAt:true, hit: false}
        if(gameState.gameStarted) {
            for(var i=0; i<gameState.battleShip.length; i++) {
                if (gameState.battleShip[i].pos.x == col && gameState.battleShip[i].pos.y==row) {
                    newObj.hit =true;
                    opponentShotHit=true;
                }
            }
            for(var i=0; i<gameState.carrier.length; i++) {
                if (gameState.carrier[i].pos.x == col && gameState.carrier[i].pos.y==row) {
                    newObj.hit =true;
                    opponentShotHit=true;
                }
            }
            for(var i=0; i<gameState.destroyer.length; i++) {
                if (gameState.destroyer[i].pos.x == col && gameState.destroyer[i].pos.y==row) {
                    newObj.hit =true;
                    opponentShotHit=true;
                }
            }
            newGrid[row][col]= newObj;
            console.log(newGrid)
        }
        setGameState({...gameState, grid: newGrid, opponentShotHit: opponentShotHit})
    }

    function fireAtOpponent(row:any, col:any) {
        console.log('fire at opponent called')
        const fireCoordinate ={
            row: row,
            column: col,
            gameId: gameState.gameId,
            uuid: gameState.uuid
        }
        
        postFireAtOpponent({variables: {payload: fireCoordinate}})
        // console.log('fired at opponent')
        // const newGrid = gameState.opponentGrid;
        // let newObj = {row:row, column:col, firedAt:true, hit: false}
        // if(gameState.gameStarted) {
        //     for(var i=0; i<gameState.battleShip.length; i++) {
        //         if (gameState.battleShip[i].pos.x == col && gameState.battleShip[i].pos.y==row) {
        //             newObj.hit =true;
        //         }
        //     }
        //     for(var i=0; i<gameState.carrier.length; i++) {
        //         if (gameState.carrier[i].pos.x == col && gameState.carrier[i].pos.y==row) {
        //             newObj.hit =true;
        //         }
        //     }
        //     for(var i=0; i<gameState.destroyer.length; i++) {
        //         if (gameState.destroyer[i].pos.x == col && gameState.destroyer[i].pos.y==row) {
        //             newObj.hit =true;
        //         }
        //     }
        //     newGrid[row][col]= newObj;
        //     console.log('new opponent grid',newGrid)
        // }
        // setGameState({...gameState, opponentGrid: newGrid})
    }

    function fireOrPlace(e: any, rowIndex:any, colIndex:any, player:string){
        let shipPlaced = false
        switch(selectedShip){
            case 'battleship': shipPlaced = gameState.battleShipsPlaced
                break;
            case 'carrier': shipPlaced = gameState.carrierPlaced
                break;
            case 'destroyer': shipPlaced = gameState.destroyerPlaced
                break;
        }
        if (shipPlaced){
            player == "fireAtOpponent" ? fireAtOpponent(rowIndex,colIndex) : fire(rowIndex,colIndex)
        }else{
            handleShipPlacement(selectedShip, rowIndex, colIndex)
        }
        
    }



function clicked() {
    console.log('gameState.gameId', gameState.gameId);
    console.log('gameState.turn', gameState.turn)
}

useEffect(()=>{
    if (firstClickedShips.carrier || firstClickedShips.battleship || firstClickedShips.destroyer){
        switch (selectedShip){
            case 'battleship': setGameGridCursor({cursor: 'pointer'}), firstClickedShips.battleship = false //add styling here
                break;
            case 'carrier': setGameGridCursor({cursor: 'pointer'}), firstClickedShips.carrier = false
                break;
            case 'destroyer': setGameGridCursor({cursor: 'pointer'}), firstClickedShips.destroyer = false
                break;
        }
    }

    

}, [selectedShip])

    return(

        <div  onClick={clicked}>
            {/* {gameState.gameStarted ? <GameStartedMessage uuid={gameState.uuid}/> : <div/>} */}
            <div className='centerWrapper'>
                <div
                    className='center'
                    >
                        <br/>
                    <GameStartedMessage uuid={gameState.uuid}
                                setGameState={(gameId:any, turn:any)=> {
                                setGameState({...gameState, turn:turn, gameId:gameId, gameStartedBackend:true})}}  />
                        
                    <ActiveGameMessage gameState={gameState}
                                fire={(row:any,col:any)=>fire(row,col)}/>
                </div>
            </div>
            <br/>
            <div className='centerWrapper'>
                <div className='center' style={gameGridCursor}>
                    <div style={gameGridStyles}>
                        {gameState.turn == gameState.uuid ? 
                            gameState.opponentGrid.map((row, rowIndex)=>{return(
                                row.map((col, colIndex)=>{return( <div style={gameState.opponentGrid[rowIndex][colIndex].firedAt ==true?
                                                                                (gameState.opponentGrid[rowIndex][colIndex].hit==true?
                                                                                    hitStyles : missedStyles):gridElementStyles}
                                                                        // onClick={()=>fireAtOpponent(rowIndex,colIndex)}
                                                                        onClick={(e)=>fireOrPlace(e, rowIndex,colIndex, "fireAtOpponent")}
                                                                                
                                                                    ></div>)}) 
                                )})
                        :
                        gameState.grid.map((row, rowIndex)=>{return(
                            row.map((col, colIndex)=>{return( <div style={gameState.grid[rowIndex][colIndex].firedAt ==true?
                                                                         (gameState.grid[rowIndex][colIndex].hit==true?
                                                                              hitStyles : missedStyles):gridElementStyles}
                                                                //    onClick={()=>fire(rowIndex,colIndex)}
                                                                onClick={(e)=>fireOrPlace(e, rowIndex,colIndex, "fire")}
                                                                        
                                                              ></div>)}) 
                         )})}
                        
                                                                        
                                                                        
                        {/* {gameState.grid.map((row, rowIndex)=>{return(
                           row.map((col, colIndex)=>{return( <div style={gameState.grid[rowIndex][colIndex].firedAt ==true?
                                                                        (gameState.grid[rowIndex][colIndex].hit==true?
                                                                             hitStyles : missedStyles):gridElementStyles}
                                                                  onClick={()=>fire(rowIndex,colIndex)}
                                                                        
                                                             ></div>)}) 
                        )})} */}
                        <CSSTransition in={gameState.carrierPlaced && gameState.turn != gameState.uuid} timeout={1000} 
                        mountOnEnter={true} unmountOnExit={true} classNames="fade">
                            <>
                                 <div onClick={handleGridCarrierClick} style={gridCarrierStyle}> </div>
                            </>
                        </CSSTransition>
                        <CSSTransition in={gameState.battleShipsPlaced && gameState.turn != gameState.uuid} timeout={1000} 
                        mountOnEnter={true} unmountOnExit={true} classNames="fade">
                            <>
                            <div onClick={handleGridBattleShipClick} style={gridBattleShipStyle}> </div>
                            </>
                        </CSSTransition>
                        <CSSTransition in={gameState.destroyerPlaced && gameState.turn != gameState.uuid} timeout={1000}
                        mountOnEnter={true} unmountOnExit={true} classNames="fade">
                            <>
                             <div onClick={handleGridDestroyerClick} style={gridDestroyerStyle}> </div>
                            </>
                        </CSSTransition>

                        
                        
                    </div>
                </div>
            </div>
            <br/>
            <CSSTransition in={!gameState.gameStarted} timeout={1000}
                        mountOnEnter={true} unmountOnExit={true} classNames="fade">
                <>
                    <div style={{ backgroundColor: '#7171ff', borderRadius: '20px', width: '97%', margin: '0% 1.5% 0% 1.5%' }}>
                        <div className='centerWrapper'>
                            <div className='center' style={{width: "80%"}}>
                                <div className="shipSelection">
                                <div className="centerWrapper">
                                    <div className="center" style={{fontSize:'20px'}}>Select Ship</div>
                                </div>
                                <br />
                                <div className="centerWrapper">
                                    <div className="center">
                                    <div
                                        className="defaultWrapper"
                                        onClick={handleCarrierClick}
                                    >
                                        <div style={selectCarrierStyle}></div>
                                        <div style={selectCarrierStyle}></div>
                                        <div style={selectCarrierStyle}></div>
                                        <div style={selectCarrierStyle}></div>
                                        <div style={selectCarrierStyle}></div>
                                    </div>
                                    </div>
                                </div>
                                <br />
                                <div className="centerWrapper">
                                    <div className="center">
                                    <div
                                        className="defaultWrapper"
                                        onClick={handleBattleShipClick}
                                    >
                                        <div style={selectBattleshipStyle}></div>
                                        <div style={selectBattleshipStyle}></div>
                                        <div style={selectBattleshipStyle}></div>
                                        <div style={selectBattleshipStyle}></div>
                                    </div>
                                    </div>
                                </div>
                                <br />
                                <div className="centerWrapper">
                                    <div className="center">
                                    <div
                                        className="defaultWrapper"
                                        onClick={handleDestroyerClick}
                                    >
                                        <div style={selectDestroyerStyle}></div>
                                        <div style={selectDestroyerStyle}></div>
                                    </div>
                                    </div>
                                </div>
                                <br />
                                </div>
                    
                            </div>
                            <div className='center' style={{width: "40%"}}>
                                <div style={buttonPanelContainer}> 
                                <CSSTransition in={gameState.battleShipsPlaced || gameState.carrierPlaced || gameState.destroyerPlaced} timeout={1000} 
                                    mountOnEnter={true} unmountOnExit={true} classNames="fade">
                                        <>
                                        <div className='manipulateShipPanel'>
                                            <div className='manipulateTitle'>Position Ship</div>
                                            <div style={arrowUpContainer}>
                                                <FontAwesomeIcon  icon={faArrowUp} 
                                                                style={arrowStyles}  
                                                                onClick={moveShipUp}
                                                                />
                                            </div>
                                            <div style={leftAndRightContainer}>
                                                <div style={arrowLeftContainer}>
                                                    <FontAwesomeIcon style={arrowStyles} 
                                                                    icon={faArrowLeft} 
                                                                    onClick={moveShipLeft}
                                                                    />
                                                </div>
                                                <div style={arrowRightContainer}>
                                                    <FontAwesomeIcon icon={faArrowRight}
                                                                    style={arrowStyles} 
                                                                    onClick={moveShipRight}
                                                                    />
                                                </div>
                                            </div>
                                            <div style={arrowDownContainer}>
                                                <FontAwesomeIcon icon={faArrowDown} 
                                                                style={arrowStyles} 
                                                                onClick={moveShipDown}/>
                                                </div>
                                            <div style={rotateLeftAndRightContainer}>
                                                <div style={rotateLeftContainer}>
                                                    <FontAwesomeIcon icon={faRotateLeft} 
                                                                    style={arrowStyles} 
                                                                    onClick={rotateShip}
                                                                    />
                                                </div>
                                                {/* <div style={rotateRightContainer}>
                                                    <FontAwesomeIcon icon={faRotateRight} 
                                                                    style={arrowStyles} />
                                                </div> */}
                                            </div>
                                        </div> 
                                        </>
                                    </CSSTransition>
                                    
                                    
                                    
                                </div>
                            </div>
                        </div>
                        <div className='centerWrapper'>
                        <CSSTransition in={gameState.battleShipsPlaced && gameState.carrierPlaced && gameState.destroyerPlaced} 
                                    timeout={1000}  mountOnEnter={true} unmountOnExit={true} classNames="fade">
                                    <>
                                        <div className='startGameBtn' onClick={startGame}>Start Game</div>                           
                                    </>
                        </CSSTransition>
                        </div>
                    </div>
                </>
            </CSSTransition>
        </div>
    );
    
}