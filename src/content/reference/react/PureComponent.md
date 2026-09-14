---
title: PureComponent
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react/PureComponent.md).

</Note>

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` è simile a [`Component`](/reference/react/Component) ma salta le ri-renderizzazioni quando props e state sono gli stessi. I componenti classe sono ancora supportati da React, ma non consigliamo di usarli nel codice nuovo.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Per saltare la ri-renderizzazione di un componente classe quando props e state sono gli stessi, estendi `PureComponent` invece di [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` è una sottoclasse di `Component` e supporta [tutte le API di `Component`.](/reference/react/Component#reference) Estendere `PureComponent` equivale a definire un metodo [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) personalizzato che confronta superficialmente props e state.


[Vedi altri esempi sotto.](#usage)

---

## Usage {/*usage*/}

### Saltare ri-renderizzazioni non necessarie per i componenti classe {/*skipping-unnecessary-re-renders-for-class-components*/}

Di norma React ri-renderizza un componente ogni volta che il genitore viene ri-renderizzato. Come ottimizzazione, puoi creare un componente che React non ri-renderizzerà quando il genitore viene ri-renderizzato, purché le nuove props e lo state siano uguali alle vecchie props e allo state precedente. I [componenti classe](/reference/react/Component) possono adottare questo comportamento estendendo `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Un componente React dovrebbe sempre avere [logica di renderizzazione pura.](/learn/keeping-components-pure) Ciò significa che deve restituire lo stesso output se props, state e context non sono cambiati. Usando `PureComponent`, stai dicendo a React che il tuo componente rispetta questo requisito, quindi React non ha bisogno di ri-renderizzarlo finché props e state non sono cambiati. Tuttavia, il tuo componente verrà comunque ri-renderizzato se cambia un context che sta usando.

In questo esempio, nota che il componente `Greeting` viene ri-renderizzato ogni volta che cambia `name` (perché è una delle sue props), ma non quando cambia `address` (perché non viene passato a `Greeting` come prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Indirizzo{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Consigliamo di definire i componenti come funzioni invece che come classi. [Vedi come migrare.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrare da un componente classe `PureComponent` a una funzione {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Nel codice nuovo consigliamo di usare componenti funzione al posto dei [componenti classe](/reference/react/Component). Se hai componenti classe esistenti che usano `PureComponent`, ecco come convertirli. Questo è il codice originale:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Indirizzo{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Quando [converti questo componente da classe a funzione,](/reference/react/Component#alternatives) avvolgilo in [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nome{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Indirizzo{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

A differenza di `PureComponent`, [`memo`](/reference/react/memo) non confronta il nuovo e il vecchio state. Nei componenti funzione, chiamare una [funzione `set`](/reference/react/useState#setstate) con lo stesso state [previene già di default la ri-renderizzazione,](/reference/react/memo#updating-a-memoized-component-using-state) anche senza `memo`.

</Note>
