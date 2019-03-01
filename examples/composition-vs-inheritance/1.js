import React from 'react';
import ReactDOM from 'react-dom';
import './1.css';

function BordoFigo(props) {
  return (
    <div className={'BordoFigo BordoFigo-' + props.colore}>
      {props.children}
    </div>
  );
}

function FinestraBenvenuto() {
  return (
    <BordoFigo colore="blue">
      <h1 className="Finestra-titolo">Benvenuto/a!</h1>
      <p className="Finestra-messaggio">
        Ti ringraziamo per questa tua visita nella nostra
        nave spaziale!
      </p>
    </BordoFigo>
  );
}

ReactDOM.render(
  <FinestraBenvenuto />,
  document.getElementById('root')
);
