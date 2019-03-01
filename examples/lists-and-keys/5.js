import React from 'react';
import ReactDOM from 'react-dom';

function Numero(props) {
  return <li>{props.valore}</li>;
}

function ListaNumeri(props) {
  const numeri = props.numeri;
  return (
    <ul>
      {numeri.map(numero => (
        <Numero key={numero.toString()} valore={numero} />
      ))}
    </ul>
  );
}

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
