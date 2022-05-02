---
id: cdn-links
title: Collegamenti a CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Sia React che ReactDOM sono disponibili su una CDN.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

Le versioni di cui sopra sono intese solo per ambienti di sviluppo, e non sono adatte per ambienti di produzione. Le versioni minificate e ottimizzate di produzione di React sono disponibili ai seguenti link:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
Per caricare una versione specifica di `react` e `react-dom`, sostituisci `17` con il numero di versione desiderato.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

### Perché l'attributo `crossorigin`? {#why-the-crossorigin-attribute}

Se servi React da una CDN, consigliamo di settare l'attributo [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Consigliamo anche di verificare che la CDN che stai usando abbia settato l'header HTTP `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Questo consente una migliore [esperienza nella gestione degli errori](/blog/2017/07/26/error-handling-in-react-16.html) in React 16 e successivi.
