import React, {useState} from "react";
import ReactDOM from "react-dom";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery, 
    useMutation,
    gql
  } from "@apollo/client";

  const client = new ApolloClient({
    uri: 'http://127.0.0.1:4000/graphql',
    cache: new InMemoryCache()
  });

  const GET_MESSAGES = gql`
  query {
      messages {
          id
          content
          user
      }
  }`;

  const POST_MESSAGE= gql`
    mutation($user:String!, $content: String!) {
        postMessage(user: $user, content: $content)
    }
  `

  const Messages = ({ user }) => {
      const {loading, error, data  } = useQuery(GET_MESSAGES, {pollInterval:500});
      if(!data) {
          return null
      }

      return (data.messages.map(({id, user: messageUser, content})=> (
       
          <div style={{
                 display: 'flex',
                 justifyContent: user == messageUser ? "flex-end" : "flex-start",
                 paddingBottom: '1em',
                 height:"50px",
                 border: '1 px solid red'
               }}
          >
        {user != messageUser &&(
            <div style={{
                height: 50,
                width:50,
                marginRight: '.5em',
                border: '2px solid black',
                borderRadius: 25,
                textAlign: 'center',
                fontSize: '18pt',
                paddingTop: 5,
                background: 'red'
            }}>
                hello
                {messageUser.slice(0,2).toUpperCase()}
            </div>
        ) }
              <div
                style={{
                    background: user == messageUser? 'green' : 'red',
                    color: user == messageUser? 'white' : 'black',
                    padding: '1em',
                    borderRadius: '1em',
                    maxWidth: '60%'
                }}
              >
                  {content}
             </div>
          </div>


          )
        )
    )


}
  
const Chat = () => {
    const[state, setState] = React.useState({
        user: 'yoshi',
        content: ''
    })
    const[postMessage]=useMutation(POST_MESSAGE);
    const send = ()=> {
        if(state.content.length >0) {
            postMessage({
                variables: state
            })
            setState({...state, content: ''})
        }
    }

    return (
        <div>
            <Messages user={state.user}/>
            <input type="text" 
                   value={state.content} 
                   onChange={(e)=> setState({...state, content: e.target.value}) }
            />
            <button style={{height: 20}} onClick={send}>Button</button>
        </div>
    )
}

export default ()=> (
    <ApolloProvider client={client}><Chat/></ApolloProvider>
)