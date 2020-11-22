---
id: javascript-environment-requirements
title: Requisiti Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 dipende dai tipi di collezione [Map](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Set). Se supporti browsers e dispositivi che non offrono tali tipi in modo nativo (ad esempio IE < 11) oppure nel caso di implementazioni non conformi (ad esempio: IE 11), considera l'inclusione di un [polyfill](https://it.wikipedia.org/wiki/Polyfill) globale nel tuo bundle dell'applicazione, quale [core-js](https://github.com/zloirock/core-js).

Un ambiente con polyfill per React 16 utilizzando core-js per supportare browser più vecchi dovrebbe essere così:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
