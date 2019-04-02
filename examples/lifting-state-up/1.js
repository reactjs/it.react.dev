import React from 'react';
import ReactDOM from 'react-dom';

function VerdettoEbollizione(props) {
  if (props.celsius >= 100) {
    return <p>L'acqua bollirebbe.</p>;
  }
  return <p>L'acqua non bollirebbe.</p>;
}

class Calcolatore extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperatura: ''};
  }

  handleChange(e) {
    this.setState({temperatura: e.target.value});
  }

  render() {
    const temperatura = this.state.temperatura;
    return (
      <fieldset>
        <legend>
          Inserisci la temperatura in gradi Celsius:
        </legend>
        <input
          value={temperatura}
          onChange={this.handleChange}
        />

        <VerdettoEbollizione
          celsius={parseFloat(temperatura)}
        />
      </fieldset>
    );
  }
}

ReactDOM.render(
  <Calcolatore />,
  document.getElementById('root')
);
