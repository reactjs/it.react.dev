---
id: rendering-elements
title: Renderizzare Elementi
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Gli elementi sono i più piccoli tra i vari mattoni costituenti apps scritte in React.

Un elemento descrive cosa vuoi vedere sullo schermo:

```js
const element = <h1>Hello, world</h1>;
```

Contrariamente agli elementi [DOM](https://developer.mozilla.org/it/docs/Web/API/Document_Object_Model) del browser, gli elementi React sono oggetti semplici e per questo più veloci da creare. Il DOM di React tiene cura di aggiornare il DOM del browser per essere consistente con gli elementi React.

>**Nota bene:**
>
>Potresti ritrovarti a confondere gli elementi con un concetto più ampiamente utilizzato: i "componenti". Introdurremo i componenti nella [prossima sezione](/docs/components-and-props.html). Gli elementi sono ciò di cui i componenti "sono fatti", per questo ti consigliamo di proseguire alla lettura di questa sezione prima di proseguire.

## Renderizzare un Elemento nel DOM {#rendering-an-element-into-the-dom}

Supponiamo di avere un `<div>` da qualche parte nel tuo file HTML:

```html
<div id="root"></div>
```

Lo chiameremo nodo DOM "radice" (o root) in quanto ogni cosa al suo interno verrà gestita dal DOM di React.

Applicazioni costruite solo con React di solito hanno un solo nodo DOM radice. Se stai integrando React all'interno di apps esistenti, potresti avere più elementi DOM radice isolati, dipende dai casi.

<<<<<<< HEAD
Per renderizzare un elemento React nel nodo DOM radice, bisogna passare entrambi a [`ReactDOM.render()`](/docs/react-dom.html#render):
=======
To render a React element, first pass the DOM element to [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot), then pass the React element to `root.render()`:
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

`embed:rendering-elements/render-an-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/ZpvBNJ?editors=1010)**

Ciò visualizzerà "Hello, world" nella pagina.

## Aggiornare un Elemento Renderizzato {#updating-the-rendered-element}

Gli elementi React sono [immutabili](https://en.wikipedia.org/wiki/Immutable_object). Una volta creato un elemento, non puoi cambiare i suoi figli o attributi. Un elemento è come un singolo fotogramma di un film: rappresenta la UI (interfaccia utente) ad un certo punto nel tempo.

<<<<<<< HEAD
Con la conoscenza che abbiamo fino a questo punto, l'unico modo per aggiornare l'UI è quello di creare un nuovo elemento e di passarlo a [`ReactDOM.render()`](/docs/react-dom.html#render).
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to `root.render()`.
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

Prendiamo in considerazione il prossimo esempio, nel quale abbiamo un orologio:

`embed:rendering-elements/update-rendered-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/gwoJZk?editors=1010)**

<<<<<<< HEAD
La funzione [`ReactDOM.render()`](/docs/react-dom.html#render) viene richiamata ogni secondo dalla [callback](https://it.wikipedia.org/wiki/Callback) passata a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).
=======
It calls [`root.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

>**Nota bene:**
>
<<<<<<< HEAD
>In pratica, la maggioranza delle apps React chiamano [`ReactDOM.render()`](/docs/react-dom.html#render) solo una volta. Nelle sezioni successive imparerai come questo codice possa essere incapsulato in [componenti aventi stato / componenti stateful](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call `root.render()` once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e
>
>Ti raccomandiamo di non saltare questi argomenti man mano che li incontriamo in quanto essi si basano l'uno sull'altro.

## React Aggiorna Solo Quanto Necessario {#react-only-updates-whats-necessary}

Il DOM di React confronta l'elemento ed i suoi figli con il precedente, applicando solo gli aggiornamenti al DOM del browser necessari a renderlo consistente con lo stato desiderato.

Puoi verificare questo fatto ispezionando [l'ultimo esempio](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) usando i developer tools:

![Ispezionando l'elemento DOM si vedono aggiornamenti granulari](../images/docs/granular-dom-updates.gif)

Anche se abbiamo creato un elemento che descrive l'intero albero della UI ad ogni tick (ogni qual volta la callback viene richiamata, nell'esempio, ogni secondo), solo il nodo testo il quale contenuto è stato modificato viene aggiornato dal DOM di React.

Nella nostra esperienza, pensare a come la UI deve essere rappresentata in ogni momento piuttosto che pensare a come alterarla nel tempo, elimina una intera classe di bugs.
