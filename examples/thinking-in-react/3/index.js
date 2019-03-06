import React from 'react';
import ReactDOM from 'react-dom';

class RigaCategoriaProdotti extends React.Component {
  render() {
    const categoria = this.props.categoria;
    return (
      <tr>
        <th colSpan="2">{categoria}</th>
      </tr>
    );
  }
}

class RigaProdotto extends React.Component {
  render() {
    const prodotto = this.props.prodotto;
    const nome = prodotto.disponibile ? (
      prodotto.nome
    ) : (
      <span style={{color: 'red'}}>{prodotto.nome}</span>
    );

    return (
      <tr>
        <td>{nome}</td>
        <td>{prodotto.prezzo}</td>
      </tr>
    );
  }
}

class TabellaProdotti extends React.Component {
  render() {
    const testoRicerca = this.props.testoRicerca;
    const soloDisponibili = this.props.soloDisponibili;

    const righe = [];
    let ultimaCategoria = null;

    this.props.prodotti.forEach(prodotto => {
      if (prodotto.nome.indexOf(testoRicerca) === -1) {
        return;
      }
      if (soloDisponibili && !prodotto.disponibile) {
        return;
      }
      if (prodotto.categoria !== ultimaCategoria) {
        righe.push(
          <RigaCategoriaProdotti
            categoria={prodotto.categoria}
            key={prodotto.categoria}
          />
        );
      }
      righe.push(
        <RigaProdotto
          prodotto={prodotto}
          key={prodotto.nome}
        />
      );
      ultimaCategoria = prodotto.categoria;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Prezzo</th>
          </tr>
        </thead>
        <tbody>{righe}</tbody>
      </table>
    );
  }
}

class BarraRicerca extends React.Component {
  constructor(props) {
    super(props);
    this.handleTestoRicercaChange = this.handleTestoRicercaChange.bind(
      this
    );
    this.handleSoloDisponibiliChange = this.handleSoloDisponibiliChange.bind(
      this
    );
  }

  handleTestoRicercaChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleSoloDisponibiliChange(e) {
    this.props.onInStockChange(e.target.checked);
  }
  render() {
    const testoRicerca = this.props.testoRicerca;
    const soloDisponibili = this.props.soloDisponibili;

    return (
      <form>
        <input
          type="text"
          placeholder="Cerca..."
          value={testoRicerca}
          onChange={this.handleTestoRicercaChange}
        />
        <p>
          <input
            type="checkbox"
            checked={soloDisponibili}
            onChange={this.handleSoloDisponibiliChange}
          />{' '}
          Mostra solo disponibili
        </p>
      </form>
    );
  }
}

class TabellaProdottiRicercabile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testoRicerca: '',
      soloDisponibili: false,
    };

    this.handleTestoRicercaChange = this.handleTestoRicercaChange.bind(
      this
    );
    this.handleSoloDisponibiliChange = this.handleSoloDisponibiliChange.bind(
      this
    );
  }

  handleTestoRicercaChange(testoRicerca) {
    this.setState({
      testoRicerca: testoRicerca,
    });
  }

  handleSoloDisponibiliChange(soloDisponibili) {
    this.setState({
      soloDisponibili: soloDisponibili,
    });
  }

  render() {
    return (
      <div>
        <BarraRicerca
          testoRicerca={this.state.testoRicerca}
          soloDisponibili={this.state.soloDisponibili}
          onFilterTextChange={this.handleTestoRicercaChange}
          onInStockChange={this.handleSoloDisponibiliChange}
        />
        <TabellaProdotti
          prodotti={this.props.prodotti}
          testoRicerca={this.state.testoRicerca}
          soloDisponibili={this.state.soloDisponibili}
        />
      </div>
    );
  }
}

const PRODOTTI = [
  {
    categoria: 'Attrezzatura Sportiva',
    prezzo: '$49.99',
    disponibile: true,
    nome: 'Palla da calcio',
  },
  {
    categoria: 'Attrezzatura Sportiva',
    prezzo: '$9.99',
    disponibile: true,
    nome: 'Palla da tennis',
  },
  {
    categoria: 'Attrezzatura Sportiva',
    prezzo: '$29.99',
    disponibile: false,
    nome: 'Palla da canestro',
  },
  {
    categoria: 'Elettronica',
    prezzo: '$99.99',
    disponibile: true,
    nome: 'iPod Touch',
  },
  {
    categoria: 'Elettronica',
    prezzo: '$399.99',
    disponibile: false,
    nome: 'iPhone 5',
  },
  {
    categoria: 'Elettronica',
    prezzo: '$199.99',
    disponibile: true,
    nome: 'Nexus 7',
  },
];

ReactDOM.render(
  <TabellaProdottiRicercabile prodotti={PRODOTTI} />,
  document.getElementById('container')
);
