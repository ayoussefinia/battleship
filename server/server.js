// const {createServer, createPubSub, Repeater} = require('@graphql-yoga/node');
// const pubsub = createPubSub();
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
// import { WebSocketServer } from 'ws';
// import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import { execute, isConstValueNode, subscribe } from 'graphql';
const pubsub = new PubSub();
// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const messages=[];
const gameArray=[];
const activeGames=[];
const waitingRoom=[];

const player1 = null;
const player2 = null;



const typeDefs= `
type Subscription {
    messages: [Message!]
    message: Message
    postCreated: Boolean
}

input GridElement {
    row: Int
    column: Int
    hit: Boolean
    firedAt: Boolean
    gameId: String
}

input FireCoordinate {
    row: Int
    column: Int
    gameId: String
    uuid: String
}

input Row {
    data: [GridElement]
}

input Grid {
    data: [Row]
}
input PostGrid {
    uuid: String!
    gameId: String!
    grid: Grid!
}

input CoordinateAsker {
    uuid: String!
    gameId: String!
}

type Coordinate {
    row: Int
    column: Int
}

input ShotResult {
    hit: Boolean
}

type StartGameObject {
    turn: String!
    gameId: String!
}


type Message {
    id: ID!
    user: String!
    content: String!
}
type Query {
    messages: [Message!]
    getGameId(payload: String!): StartGameObject
    getOpposingShotCoordinate(payload: CoordinateAsker) : Coordinate
}

type Mutation {
    postMessage(user: String!, content: String!): ID!
    postGameArray(payload: PostGrid): Boolean
    postUUID(payload: String!): ID!
    postFireAtOpponent(payload: FireCoordinate!): Boolean
}
`;

const resolvers = {
Query: {
    getOpposingShotCoordinate: (parent, {payload})=> {
        
        for(var i=0; i<activeGames.length; i++) {
            if(activeGames[i].id == payload.gameId) {
                // console.log('*********inside first if')
                if(payload.uuid != activeGames[i].turn){
                    // console.log('*********inside second  if')
                    // console.log('last attact:', activeGames[i].lastAttack)
                    const coordinate = {
                        row: activeGames[i].lastAttack.row,
                        column: activeGames[i].lastAttack.column
                    }
                    return coordinate;
                } else {
                    const coordinate = {
                        row:null,
                        column: null
                    }
                    return coordinate;
                }
            }
        }
        console.log('get opposing coordinate called by:', payload)


    },
    messages: ()=> {messages},
    getGameId: (parent, {payload})=> {
        console.log('get game id called payload: ', payload)
        if(activeGames.length>0) {
            // console.log(activeGames[0].id, '==', payload)
            for(var i=0; i<activeGames.length; i++) {
                if(activeGames[i].player1 == payload || activeGames[i].player2 == payload) {
                    const StartGameObject = {
                        turn: activeGames[i].turn,
                        gameId: activeGames[i].id
                    };
                    // StartGameObject.gameId = activeGames[i].id;
                    // StartGameObject.turn = activeGames[i].turn;
                    return StartGameObject;
                }
            }
        } 
        if(activeGames.length ==0 && waitingRoom.length ==0) {
            const StartGameObject = {
                turn: 'none',
                gameId: 'none'
            };
            // const StartGameObject = {};
            // StartGameObject.gameId = 'none';
            // StarGameObject.turn = 'none';
            return StartGameObject;
        }

       if (waitingRoom.length >0) {
            for(var i=0; i<waitingRoom.length; i++) {
                if(waitingRoom[i]==payload) {
                    const StartGameObject = {
                        turn: 'waitingOther',
                        gameId: 'waitingOther'
                    };
                    // StartGameObject.gameId = 'waiting';
                    // StartGameObject.turn = 'waiting';
                    return StartGameObject;
                }else {
                    const StartGameObject = {
                        turn: 'waitingYou',
                        gameId: 'waitingYou'
                    };
                    return StartGameObject;
                }
            }
        }


    }
},
Mutation: {
    postFireAtOpponent: (parent, {payload})=>{
        
        const gameId =payload.gameId;
        const row= payload.row;
        const column =payload.column;
        const uuid = payload.uuid;
        let grid;
        for(var i=0; i<activeGames.length; i++) {
            if (activeGames[i].id == gameId) {
                console.log('found game', activeGames[i])
                activeGames[i].lastAttack ={
                    row: row,
                    column:column
                }
                // if(uuid == activeGames[i].player1) {
              
            console.log('fire at opponent calle last Attack', activeGames[i].lastAttack)      
                // } 
                // else {
                   
                // }

            }
            console.log('fire at opponent grid:',grid)
        }
        
    },
    postMessage: (parent, {user, content}) => {
        const message= {
            id: messages.length,
            user: user,
            content: content
        }
        messages.push(message)
        
        pubsub.publish('MESSAGE_CREATED', {message: message})
        pubsub.publish('MESSAGES', {messages:[message]})
        // pubsub.publish('randomNumber', {messages: messages})
        return messages.length;
    },
    postGameArray: (parent, {payload})=> {
        console.log('post game array called')
        console.log(payload)
        // if (payload.)
        // console.log(payload.data[0].data)
    },
    postUUID: (parent, {payload})=> {
        if(waitingRoom.length==0) {
            waitingRoom.push(payload);
            console.log('waiting room',waitingRoom)
            console.log('active games',activeGames[0])
            return 0;
        }
        else if (waitingRoom.length>0 && waitingRoom[waitingRoom.length] != payload) {
            console.log('inside else if')
            const player1 = waitingRoom.pop();
            const player2 = payload;
            const id =Math.random().toString().slice(2, 15);
            
            let initialGrid = Array(8).fill(null).map(row => new Array(8).fill(null))
            for(var i =0; i<8;i++){
                for(var j=0; j<8; j++){
                    let  obj={column:0, row:0, hit:false, firedAt:false}
                    obj.row = i;
                    obj.column=j
                    initialGrid[i][j] = obj
                }
            }
  


            const game={
                player1: player1,
                player2: player2,
                id: id,
                player1Grid:initialGrid,
                player2Grid:initialGrid,
                gameOver:false,
                turn: player1,
                lastAttack: {
                    row:null,
                    column:null
                },
                lastAttackResult: {
                    hit: false
                },
                turnIterator:0
            }
            console.log('game:',game)
            activeGames.push(game)
            console.log('postUUId  mutation called')
            console.log('waiting room',waitingRoom)
            console.log('active games',activeGames[0])
            return(id);
        }
      

    }
},
Subscription: {
    messages:  {
       subscribe: () => {
           return pubsub.asyncIterator(['MESSAGES'])
        }
    },
    message: {
        subscribe: () => pubsub.asyncIterator('MESSAGE_CREATED')
    },

    postCreated: {
        subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
    }
 
}}

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: '/graphql',
// });
// Save the returned server's info so we can shutdown this server later
// const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  context: ({req,res}) => ({req,res,pubsub}),
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
             subscriptionServer.close();
          },
        };
      },
    },
  ],
});
const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    async onConnect(connectionParams, webSocket,context) {
        console.log('connected')
        return {
            pubsub
        }
    },
    async onDisconnect(websocket) {
        console.log('disconnected')
    }
}, {server:httpServer, path:server.graphqlPath})
await server.start();
server.applyMiddleware({ app });

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
await new Promise(resolve => httpServer.listen({port:4000},resolve));
console.log('started')


// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// // 









// const httpServer = createServer(app);
// const schema = makeExecutableSchema({ typeDefs, resolvers });
// // ...
// const server = new ApolloServer({
//   schema,
// });
// app.listen(4000)


// This `app` is the returned value from `express()`.
// const httpServer = createServer(app);




// const messages=[];
// const subscibers= [];
// const onMessagesUpdates= (fn) => subscibers.push(fn); 

// const server = createServer({schema: {

// });


// server.start((port)=>{
//     console.log(`server started on port ${port}`)})