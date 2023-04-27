---
title: Aggiungere React ad un Progetto Esistente
---

<Intro>

Se vuoi aggiungere della interattività al tuo progetto esistente, non serve che tu lo riscriva in React. Aggiungi React al tuo stack esistente e renderizza i componenti interattivi di React ovunque.

</Intro>

<Note>

**È necessario installare [Node.js](https://nodejs.org/it/) per lo sviluppo locale.** Sebbene tu possa [provare React](/learn/installation#try-react) online o con una semplice pagina HTML, realisticamente la maggior parte degli strumenti JavaScript che vorrai utilizzare per lo sviluppo richiedono Node.js.

</Note>

## Utilizzare React per un'intera subroute di un sito web esistente {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Supponiamo tu abbia una web app esistente a `example.com` costruita con un'altra tecnologia server (come Rails) e tu voglia implementare tutte le tue routes a partire da `example.com/some-app/` completamente con React.

Ecco come ti consigliamo di impostarla:

1. **Crea la parte React della tua app** utilizzando uno dei [framework basati su React](/learn/start-a-new-react-project).
2. **Specifica `/some-app` come *percorso di base*** nella configurazione del tuo framework (ecco come: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configura il tuo server o un proxy** in modo che tutte le richieste in `/some-app/` siano gestite dalla tua app React.

Ciò garantisce che la parte React della tua app possa [trarre vantaggio dalle best practices](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) integrate in tali framework.

Molti framework basati su React sono full-stack e consentono alla tua app React di trarre vantaggio dal server. Tuttavia, puoi utilizzare lo stesso approccio anche se non puoi o non vuoi eseguire JavaScript sul server. In tal caso, pubblica invece l'esportazione HTML/CSS/JS ([output di `next export`](https://nextjs.org/docs/advanced-features/static-html-export) per Next.js, output predefinito per Gatsby) in `/some-app/`.

## Utilizzare React per una parte della tua pagina esistente {/*using-react-for-a-part-of-your-existing-page*/}

Supponiamo che tu abbia una pagina esistente costruita con un'altra tecnologia (una server come Rails o una client come Backbone) e desideri renderizzare i componenti React interattivi da qualche parte in quella pagina. Questa è una modalità comune per integrare React--di fatto, l'utilizzo di React in Meta è apparso così per molti anni!

Puoi fare questo in due step:

1. **Configura un ambiente JavaScript** che ti permetta di utilizzare la [sintassi JSX](/learn/writing-markup-with-jsx), suddividi il tuo codice in moduli con la sintassi [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) ed utilizza i pacchetti (per esempio, React) dal registro dei pacchetti [npm](https://www.npmjs.com/).
2. **Renderizza i tuoi componenti React** dove vuoi visualizzarli sulla pagina.

L'approccio esatto dipende dalla configurazione della tua pagina esistente, esaminiamo quindi alcuni dettagli.

### Step 1: Configurare un ambiente JavaScript modulare {/*step-1-set-up-a-modular-javascript-environment*/}

Un ambiente JavaScript modulare ti consente di scrivere i tuoi componenti React in file individuali, invece di dover scrivere tutto il tuo codice in un singolo file. Questo ti consente anche di utilizzare tutti i meravigliosi pacchetti pubblicati da altri sviluppatori sul registro [npm](https://www.npmjs.com/)--incluso lo stesso React! Il modo in cui lo fai dipende dalla tua configurazione esistente:

* **Se la tua app è già suddivisa in file che utilizzano istruzioni di `import`,** prova ad utilizzare la configurazione di cui già disponi. Controlla se la scrittura di `<div />` nel tuo codice JS causa un errore di sintassi. Se questo causa un errore di sintassi, potresti aver bisogno di [trasformare il tuo codice JavaScript con Babel](https://babeljs.io/setup) ed abilitare il [preset Babel React](https://babeljs.io/docs/babel-preset-react) per poter utilizzare la sintassi JSX.

* **Se la tua app non dispone di una configurazione esistente per la compilazione di moduli JavaScript**, configurala con [Vite](https://vitejs.dev/). La community di Vite mantiene [molte integrazioni con i framework di backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), tra cui Rails, Django e Laravel. Se il tuo framework di backend non è elencato, [segui questa guida](https://vitejs.dev/guide/backend-integration.html) per integrare manualmente le build di Vite con il tuo backend.

Per controllare che la tua configurazione sia funzionante, lancia questo comando nella cartella del tuo progetto:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Poi aggiungi queste linee di codice in cima al tuo file JavaScript principale (potrebbe essere chiamato `index.js` o `main.js`):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Il contenuto esistente della tua pagina (in questo esempio viene sostituito) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Pulisci il contenuto HTML esistente
document.body.innerHTML = '<div id="app"></div>';

// Sostituiscilo renderizzando il tuo componente React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Se l'intero contenuto della tua pagina è stato sostituito da un "Hello, world!", tutto ha funzionato! Continua a leggere.

<Note>

L'integrazione di un ambiente JavaScript modulare in un progetto esistente per la prima volta può sembrare intimidatorio, ma ne vale la pena! Se rimani bloccato, prova le nostre [risorse della community](/community) o la [Chat Vite](https://chat.vitejs.dev/).

</Note>

### Step 2: Renderizzare i componenti React in qualsiasi punto della pagina {/*step-2-render-react-components-anywhere-on-the-page*/}

Nello step precedente, hai inserito questo codice all'inizio del tuo file principale:

```js
import { createRoot } from 'react-dom/client';

// Pulisci il contenuto HTML esistente
document.body.innerHTML = '<div id="app"></div>';

// Sostituiscilo renderizzando il tuo componente React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Ovviamente, in realtà non vuoi cancellare il contenuto HTML esistente!

Cancella questo codice.

Invece, probabilmente vorrai renderizzare i tuoi componenti React in punti specifici del tuo codice HTML. Apri la tua pagina HTML (oppure i template server che la generano) ed aggiungi un attributo [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) univoco ad un qualsiasi tag, per esempio:

```html
<!-- ... da qualche parte nel tuo html ... -->
<nav id="navigation"></nav>
<!-- ... altro html ... -->
```

Questo ti permette di trovare quell'elemento HTML tramite [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) e di passarlo al metodo [`createRoot`](/reference/react-dom/client/createRoot) così da poter renderizzare il tuo componente React al suo interno:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Implementa una vera barra di navigazione
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Nota come il contenuto HTML originale di `index.html` sia stato preservato, ma il tuo componente React `NavigationBar` ora appare all'interno del `<nav id="navigation">` del tuo HTML. Leggi la documentazione sull'[uso di `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) per saperne di più sul rendering di componenti React all'interno di una pagina HTML esistente.

Quando adotti React in un progetto esistente, è comune iniziare con piccoli componenti interattivi (come i pulsanti), e poi gradualmente continuare a "salire" fino a quando alla fine l'intera pagina è costruita con React. Se raggiungi mai quel punto, ti consigliamo di migrare verso [un framework React](/learn/start-a-new-react-project) subito dopo per ottenere il massimo da React.

## Utilizzare React Native in un'app mobile nativa esistente {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) può anche essere integrato in app native esistenti in modo incrementale. Se hai un'app nativa esistente per Android (Java o Kotlin) o iOS (Objective-C o Swift), [segui questa guida](https://reactnative.dev/docs/integration-with-existing-apps) per aggiungere una schermata React Native ad essa.
