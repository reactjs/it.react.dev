---
id: react-without-jsx
title: React senza JSX
permalink: docs/react-without-jsx.html
---

JSX non è un requisito per l'utilizzo di React. Usare React senza JSX è particolarmente utile quando non si vuole impostare la compilazione nel proprio ambiente di sviluppo.

Ogni elemento JSX è solo zucchero sintattico per chiamare `React.createElement(component, props, ...children)`. Quindi, tutto ciò che puoi fare con JSX può essere fatto anche solo semplicemente con JavaScript.

Ad esempio, questo codice scritto con JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

può essere compilato in questo codice che non usa JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Se sei curioso di vedere più esempi di come JSX viene convertito in JavaScript, puoi provare [il compilatore online di Babel](babel://jsx-simple-example).

Il componente può essere fornito come una stringa, una sottoclasse di `React.Component`, o una semplice funzione.

Se ti stanchi di digitare tante volte `React.createElement`, un modello comune è di assegnare un'abbreviazione:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Se utilizzi questa forma abbreviata di `React.createElement`, può essere quasi altrettanto conveniente usare React senza JSX.

In alternativa, puoi fare riferimento ai progetti della community come [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) e [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) che offrono una sintassi più concisa.
