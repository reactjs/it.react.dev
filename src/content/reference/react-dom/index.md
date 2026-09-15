---
title: API React DOM
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/reference/react-dom/index.md).

</Note>

<Intro>

Il pacchetto `react-dom` contiene metodi supportati solo nelle applicazioni web (che vengono eseguite nell'ambiente DOM del browser). Non sono supportati in React Native.

</Intro>

---

## API {/*apis*/}

Queste API possono essere importate dai tuoi componenti. Vengono usate raramente:

* [`createPortal`](/reference/react-dom/createPortal) ti permette di renderizzare componenti figli in una parte diversa dell'albero DOM.
* [`flushSync`](/reference/react-dom/flushSync) ti permette di forzare React a svuotare in modo sincrono un aggiornamento di state e ad aggiornare il DOM.

## API di precaricamento delle risorse {/*resource-preloading-apis*/}

Queste API possono essere usate per accelerare le app precaricando risorse come script, fogli di stile e font non appena sai di averne bisogno, ad esempio prima di navigare verso un'altra pagina in cui verranno usate.

I [framework basati su React](/learn/creating-a-react-app) gestiscono spesso il caricamento delle risorse per te, quindi potresti non dover chiamare queste API personalmente. Consulta la documentazione del tuo framework per i dettagli.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) ti permette di precaricare l'indirizzo IP di un nome di dominio DNS a cui ti aspetti di connetterti.
* [`preconnect`](/reference/react-dom/preconnect) ti permette di connetterti a un server da cui ti aspetti di richiedere risorse, anche se non sai ancora quali risorse ti serviranno.
* [`preload`](/reference/react-dom/preload) ti permette di recuperare un foglio di stile, un font, un'immagine o uno script esterno che ti aspetti di usare.
* [`preloadModule`](/reference/react-dom/preloadModule) ti permette di recuperare un modulo ESM che ti aspetti di usare.
* [`preinit`](/reference/react-dom/preinit) ti permette di recuperare ed eseguire uno script esterno o di recuperare e inserire un foglio di stile.
* [`preinitModule`](/reference/react-dom/preinitModule) ti permette di recuperare ed eseguire un modulo ESM.

## API di renderizzazione sul server {/*server-rendering-apis*/}

Questa API controlla come i componenti vengono renderizzati sul server:

* [`browser`](/reference/react-dom/browser) ti permette di contrassegnare un componente come solo per il browser durante la renderizzazione sul server.

---

## Punti di ingresso {/*entry-points*/}

Il pacchetto `react-dom` fornisce due punti di ingresso aggiuntivi:

* [`react-dom/client`](/reference/react-dom/client) contiene API per renderizzare componenti React sul client (nel browser).
* [`react-dom/server`](/reference/react-dom/server) contiene API per renderizzare componenti React sul server.

---

## API rimosse {/*removed-apis*/}

Queste API sono state rimosse in React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): vedi [alternative](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): usa [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) invece.
* [`render`](https://18.react.dev/reference/react-dom/render): usa [`createRoot`](/reference/react-dom/client/createRoot) invece.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): usa [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) invece.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): usa le API di [`react-dom/server`](/reference/react-dom/server) invece.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): usa le API di [`react-dom/server`](/reference/react-dom/server) invece.
