import React from 'react';
import ReactDOM from 'react-dom';
import './3.css';

function BordoFigo(props) {
  return (
    <div className={'BordoFigo BordoFigo-' + props.colore}>
      {props.children}
    </div>
  );
}

function Finestra(props) {
  return (
    <BordoFigo colore="blue">
      <h1 className="Finestra-titolo">{props.titolo}</h1>
      <p className="Finestra-messaggio">{props.messaggio}</p>
    </BordoFigo>
  );
}

function FinestraBenvenuto() {
  return (
    <Finestra
      titolo="Benvenuto/a!"
      messaggio="Ti ringraziamo per questa tua visita nella nostra
      nave spaziale!"
    />
  );
}

ReactDOM.render(
  <FinestraBenvenuto />,
  document.getElementById('root')
);
