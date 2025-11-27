---
title: Installazione
---

<Intro>

React è stato progettato sin dal principio per essere adottato gradualmente. A seconda dei tuoi gusti, puoi usare il minimo o il maggior numero di funzionalità offerte da React. Se vuoi avere un assaggio di React, aggiungere un po' di interattività ad una pagina HTML, o sviluppare una applicazione complessa basata su React, questa sezione ti aiuterà nei primi passi.

</Intro>

## Prova React {/*try-react*/}

Non devi installare nulla se vuoi divertirti con React. Prova a modificare questa sandbox!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Puoi modificarla direttamente o aprirla in un nuovo tab premendo il bottone "Fork" nell'angolo in alto a destra.

La maggioranza delle pagine della documentazione di React contengono sandboxes come questa. Al di fuori della documentazione, esistono alcune sandboxes online che supportano React: ad esempio, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), o [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Per provare React localmente sul tuo computer, [scarica questa pagina HTML.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Aprila nel tuo editor e nel tuo browser!

## Creare un'App React {/*creating-a-react-app*/}

Se vuoi iniziare una nuova app React, puoi [creare un'app React](/learn/creating-a-react-app) utilizzando un framework consigliato.

## Costruire un'App React da zero {/*build-a-react-app-from-scratch*/}

Se un framework non è adatto al tuo progetto, preferisci costruire il tuo framework, o vuoi semplicemente imparare le basi di un'app React puoi [costruire un'app React da zero](/learn/build-a-react-app-from-scratch).

## Aggiungi React ad un progetto esistente {/*add-react-to-an-existing-project*/}

Se vuoi provare ad utilizzare React nella tua app esistente o in un sito web, puoi [aggiungere React a un progetto esistente.](/learn/add-react-to-an-existing-project)

<Note>

#### Dovrei usare Create React App? {/*should-i-use-create-react-app*/}

No. Create React App è stato deprecato. Per maggiori informazioni, consulta [Il sunsetting di Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Prossimi passi {/*next-steps*/}

Vai alla guida [Quick Start](/learn) per un tour dei più importanti concetti di React che incontrerai ogni giorno.
