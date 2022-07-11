---
id: javascript-environment-requirements
title: Requisiti Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 supporta tutti i browser moderni (Edge, Firefox, Chrome, Safari, etc).

Se devi supportare browser più vecchi e dispositivi quali Internet Explorer che non includono funzioni native o che hanno implementazioni non standard, considera l'utilizzo di polyfill nel tuo pacchetto applicazione.

Di seguito una lista delle funzioni moderne che React 18 utilizza:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

La scelta del corretto polyfill per queste funzionalità dipende dal tuo ambiente. Per molti utenti, è sufficiente configurare [Browserlist](https://github.com/browserslist/browserslist). Per altri, è necessario importare polyfills come [`core-js`](https://github.com/zloirock/core-js) direttamente.
