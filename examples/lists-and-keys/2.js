import React from 'react';
import ReactDOM from 'react-dom';

function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    <li key={numero.toString()}>
      {numero}
    </li>
  );
  return (
    <ul>{lista}</ul>
  );
}

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
