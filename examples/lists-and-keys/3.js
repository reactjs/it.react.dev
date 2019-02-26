import React from 'react';
import ReactDOM from 'react-dom';

function Numero(props) {
  // Corretto! Non è necessario specificare la chiave qui:
  return <li>{props.valore}</li>;
}

function ListaNumeri(props) {
  const numeri = props.numeri;
  const lista = numeri.map((numero) =>
    // Corretto! La chiave deve essere specificata all'interno dell'array.
    <Numero key={numero.toString()}
            valore={numero} />
  );
  return (
    <ul>
      {lista}
    </ul>
  );
}

const numeri = [1, 2, 3, 4, 5];
ReactDOM.render(
  <ListaNumeri numeri={numeri} />,
  document.getElementById('root')
);
