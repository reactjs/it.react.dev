import React from 'react';
import ReactDOM from 'react-dom';
import './4.css';

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
      <p className="Finestra-messaggio">
        {props.messaggio}
      </p>
      {props.children}
    </BordoFigo>
  );
}

class FinestraRegistrazione extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Finestra
        titolo="Programma di Esplorazione di Marte"
        messaggio="Qual'è il tuo nome?">
        <input
          value={this.state.login}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSignUp}>
          Registrami!
        </button>
      </Finestra>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Benvenuto/a a bordo, ${this.state.login}!`);
  }
}

ReactDOM.render(
  <FinestraRegistrazione />,
  document.getElementById('root')
);
