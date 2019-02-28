import React from 'react';
import ReactDOM from 'react-dom';
import './2.css';

function Contatti() {
  return <div className="Contatti" />;
}

function Chat() {
  return <div className="Chat" />;
}

function Pannello(props) {
  return (
    <div className="Pannello">
      <div className="Pannello-sinistra">
        {props.sinistra}
      </div>
      <div className="Pannello-destra">{props.destra}</div>
    </div>
  );
}

function App() {
  return (
    <Pannello sinistra={<Contatti />} destra={<Chat />} />
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
