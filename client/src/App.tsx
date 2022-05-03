import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";
import BattleShip from './Battleship/Battleship';

// const GET_MESSAGES = gql`
//   query {
//     messages {
//       user
//       content
//     }
//   }
// `;

// function getMessages() {
//   const { loading, error, data } = useQuery(GET_MESSAGES);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   console.log(data)
// }

function App() {
  return (
    <div className="App">

      <BattleShip/>
    </div>
  );
}

export default App;
