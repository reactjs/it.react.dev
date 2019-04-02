import React from 'react';
import ReactDOM from 'react-dom';

const scale = {
  c: 'Celsius',
  f: 'Fahrenheit',
};

class InputTemperatura extends React.Component {
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
    const scala = this.props.scala;
    return (
      <fieldset>
        <legend>
          Inserisci la temperatura in gradi {scale[scala]}:
        </legend>
        <input
          value={temperatura}
          onChange={this.handleChange}
        />
      </fieldset>
    );
  }
}

class Calcolatore extends React.Component {
  render() {
    return (
      <div>
        <InputTemperatura scala="c" />
        <InputTemperatura scala="f" />
      </div>
    );
  }
}

ReactDOM.render(
  <Calcolatore />,
  document.getElementById('root')
);
