---
title: Installazione
---

<Intro>

React è stato progettato sin dal principio per essere adottato gradualmente. A seconda dei tuoi gusti, puoi usare il minimo o il maggior numero di funzionalità offerte da React. Se vuoi avere un assaggio di React, aggiungere un po' di interattività ad una pagina HTML, o sviluppare una applicazione complessa basata su React, questa sezione ti aiuterà nei primi passi.

</Intro>

<YouWillLearn isChapter={true}>

* [How to start a new React project](/learn/start-a-new-react-project)
* [How to add React to an existing project](/learn/add-react-to-an-existing-project)
* [Come configurare il tuo editor](/learn/editor-setup)
* [Come installare i React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

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

La maggioranza delle pagine della documentazione di React contengono sandboxes come questa. Al di fuori della documentazione, esistono alcune sandboxes online che supportano React: ad esempio, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), o [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### Prova React localmente {/*try-react-locally*/}

Per provare React localmente sul suo computer, [scarica questa pagina HTML.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Aprila nel tuo editor e nel tuo browser!

## Start a new React project {/*start-a-new-react-project*/}

If you want to build an app or a website fully with React, [start a new React project.](/learn/start-a-new-react-project)

## Add React to an existing project {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)
