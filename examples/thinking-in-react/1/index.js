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
    const righe = [];
    let ultimaCategoria = null;

    this.props.prodotti.forEach(prodotto => {
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
  render() {
    return (
      <form>
        <input type="text" placeholder="Cerca..." />
        <p>
          <input type="checkbox" /> Mostra solo disponibili
        </p>
      </form>
    );
  }
}

class TabellaProdottiRicercabile extends React.Component {
  render() {
    return (
      <div>
        <BarraRicerca />
        <TabellaProdotti prodotti={this.props.prodotti} />
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
