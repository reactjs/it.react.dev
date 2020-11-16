---
id: javascript-environment-requirements
title: Requisiti Ambiente JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 dipende dai tipi di collezione [Map](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Map) e [Set](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Set). Se supporti browsers e dispositivi che non offrono tali tipi in modo nativo (ad esempio IE < 11) oppure nel caso di implementazioni non conformi (ad esempio: IE 11), considera l'inclusione di un [polyfill](https://it.wikipedia.org/wiki/Polyfill) globale nel tuo bundle dell'applicazione, quale [core-js](https://github.com/zloirock/core-js) o [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

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
