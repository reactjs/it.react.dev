---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

## Impacchettamento {#bundling}

Molte applicazioni React hanno i loro file "impacchettati" usando strumenti come [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) oppure [Browserify](http://browserify.org/). Il processo di "impacchettamento" avviene prendendo tutti i file importati e unendoli tutti in un unico file, chiamato "bundle". Questo file può essere poi incluso all'interno della webpage per caricare l'intera applicazione tutta in una volta.

#### Esempio {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Nota:
>
> I tuoi pacchetti avranno un aspetto molto diverso da questo.

Se state usando [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), o qualche tool similare, potreste avere una configurazione di Webpack che effettua il processo d'impacchettamento della tua applicazione.

In caso contrario è necessario impostare l'impacchettamento dell'applicazione manualmente. Ad esempio puoi seguire queste guide sulla documentazione di Webpack, [Installation](https://webpack.js.org/guides/installation/) e [Getting Started](https://webpack.js.org/guides/getting-started/).

## Code Splitting {#code-splitting}

Il processo d'impacchettamento va bene, ma se la tua applicazione cresce di conseguenza pure il bundle cresce, e questo specialmente se si includono librerie di terze parti. E' necessario prestare attenzione al codice che si include all'interno del proprio bundle, in modo tale da non renderlo troppo pesante per non causare rallentamenti nella sua esecuzione.

Per evitare di avere un bundle enorme, è buona pratica iniziare a suddividere il proprio bundle. Lo "spezzamento del codice" è una funzionalità supportata da [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) e Browserify (attraverso [factor-bundle](https://github.com/browserify/factor-bundle))
i quali creano molteplici bundle che possono essere caricati dinamicamente a tempo di esecuzione.

Spezzare il codice della propria applicazione ti può aiutare ad effettuare il "lazy-load (caricamento pigro)" di funzionalità che sono necessario in quel preciso istante, e questo processo può incrementare di parecchio le performance della propria applicazione. Anche se non hai ridotto la quantità complessiva di codice nella tua applicazione, hai evitato di caricare codice di cui l'utente potrebbe non avere mai bisogno e hai ridotto la quantità di codice necessaria durante il caricamento iniziale.

## `import()` {#import}

Il miglior modo per introdurre lo "spezzamento del codice" all'interno dell'applicazione è attraverso la sinassi `import()`.

**Prima:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Dopo:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Note:
>
> `React.lazy` and Suspense are not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend [Loadable Components](https://github.com/gregberge/loadable-components). It has a nice [guide for bundle splitting with server-side rendering](https://loadable-components.com/docs/server-side-rendering/).

The `React.lazy` function lets you render a dynamic import as a regular component.

**Prima:**

```js
import OtherComponent from './OtherComponent';
```

**Dopo:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

This will automatically load the bundle containing the `OtherComponent` when this component is first rendered.

`React.lazy` takes a function that must call a dynamic `import()`. This must return a `Promise` which resolves to a module with a `default` export containing a React component.

The lazy component should then be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we're waiting for the lazy component to load.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

The `fallback` prop accepts any React elements that you want to render while waiting for the component to load. You can place the `Suspense` component anywhere above the lazy component. You can even wrap multiple lazy components with a single `Suspense` component.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Contenitori di Errori {#error-boundaries}

If the other module fails to load (for example, due to network failure), it will trigger an error. You can handle these errors to show a nice user experience and manage recovery with [Contenitori di Errori](/docs/error-boundaries.html). Once you've created your Contenitore di Errori, you can use it anywhere above your lazy components to display an error state when there's a network error.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Route-based code splitting {#route-based-code-splitting}

Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that tree shaking keeps working and that you don't pull in unused components.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
