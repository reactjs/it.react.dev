---
id: fragments
title: Frammenti
permalink: docs/fragments.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`<Fragment>`](https://react.dev/reference/react/Fragment)

</div>

Un modello comune in React è di restituire molteplici elementi per un componente. I frammenti ti consentono di raggruppare una lista di figli senza aggiungere nodi extra al DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

C'è anche una nuova [sintassi breve](#short-syntax) per dichiararli.

## Motivazione {#motivation}

Un modello comune per un componente è di restituire una lista di figli. Guarda questo esempio di una parte del codice React:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` avrebbe bisogno di restituire multipli elementi `<td>` in ordine per affinchè l'HTML renderizzato sia valido. Se un parente div è stato usato dentro il `render()` di `<Columns />`, l'HTML risultante non sarà valido.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

genererà in `<Table />` il seguente risultato:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

I frammenti risolvono questo problema.

## Utilizzo {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

che darà in `<Table />` un corretto risultato:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Sintassi Breve {#short-syntax}

C'è una nuova e breve sintassi che puoi usare per dichiarare i frammenti. Sembra come se avessimo dei tag vuoti:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Puoi utilizzare `<></>` allo stesso modo in cui hai utilizzato ogni altro elemento, ad eccezione che questa sintassi non supporta chiavi e attributi.

### Frammenti Chiave {#keyed-fragments}

I frammenti dichiarati con l'esplicita sintassi `<React.Fragment>` possono avere chiavi. Un caso di utilizzo può essere mappare una collezione su un array di frammenti -- per esempio, per creare una lista di descrizioni:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` è l'unico attributo che può essere accettato da `Fragment`. In futuro, potremo aggiungere un supporto per attributi aggiuntivi, come per i gestori di eventi.

### Dimostrazione dal vivo {#live-demo}

Puoi provare la nuova sintassi del frammento JSX con questo [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
