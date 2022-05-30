---
id: javascript-environment-requirements
title: Requisiti Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 dipende dai tipi di collezione [Map](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Set). Se supporti browsers e dispositivi che non offrono tali tipi in modo nativo (ad esempio IE < 11) oppure nel caso di implementazioni non conformi (ad esempio: IE 11), considera l'inclusione di un [polyfill](https://it.wikipedia.org/wiki/Polyfill) globale nel tuo bundle dell'applicazione, quale [core-js](https://github.com/zloirock/core-js).

Un ambiente con polyfill per React 16 utilizzando core-js per supportare browser più vecchi dovrebbe essere così:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Ciao Mondo!</h1>,
  document.getElementById('root')
);
```

React dipende inoltre da `requestAnimationFrame` (anche negli ambienti di test).  
Puoi usare il pacchetto [raf](https://www.npmjs.com/package/raf) come shim (alternativa avente le stesse API) per `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
