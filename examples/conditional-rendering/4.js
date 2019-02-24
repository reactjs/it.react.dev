function MessaggioAvviso(props) {
  if (!props.attenzione) {
    return null;
  }

  return (
    <div className="warning">
      Attenzione!
    </div>
  );
}

class Pagina extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mostraAvviso: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      mostraAvviso: !state.mostraAvviso
    }));
  }

  render() {
    return (
      <div>
        <MessaggioAvviso attenzione={this.state.mostraAvviso} />
        <button onClick={this.handleToggleClick}>
          {this.state.mostraAvviso ? 'Nascondi' : 'Mostra'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Pagina />,
  document.getElementById('root')
);