---
title: "API legacy di React"
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/legacy.md).

</Note>

<Intro>

Queste API sono esportate dal pacchetto `react`, ma non sono consigliate per il codice scritto ex novo. Consulta le singole pagine delle API collegate per le alternative suggerite.

</Intro>

---

## API legacy {/*legacy-apis*/}

* [`Children`](/reference/react/Children) ti permette di manipolare e trasformare il JSX ricevuto come prop `children`. [Vedi alternative.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) ti permette di creare un elemento React usando un altro elemento come punto di partenza. [Vedi alternative.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) ti permette di definire un componente React come classe JavaScript. [Vedi alternative.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) ti permette di creare un elemento React. In genere userai JSX.
* [`createRef`](/reference/react/createRef) crea un oggetto ref che può contenere un valore arbitrario. [Vedi alternative.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) permette al tuo componente di esporre un nodo DOM al componente padre con un [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) verifica se un valore è un elemento React. Tipicamente usato con [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) è simile a [`Component`,](/reference/react/Component) ma salta le ri-renderizzazioni con le stesse props. [Vedi alternative.](/reference/react/PureComponent#alternatives)

---

## API rimosse {/*removed-apis*/}

Queste API sono state rimosse in React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): usa JSX invece.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): usa [`static contextType`](#static-contexttype) invece.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): usa [`static contextType`](#static-contexttype) invece.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): usa [`Context`](/reference/react/createContext#provider) invece.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): usa un sistema di tipi come [TypeScript](https://www.typescriptlang.org/) invece.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): usa [`createRef`](/reference/react/createRef) invece.
