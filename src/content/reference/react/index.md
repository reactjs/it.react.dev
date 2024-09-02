---
title: Panoramica della documentazione di React
---

<Intro>

Questa sezione fornisce una documentazione di riferimento dettagliata per lavorare con React. Per una introduzione a React, visita la sezione [Learn](/learn).

</Intro>

La documentazione di riferimento su React è suddivisa in sottosezioni funzionali:

## React {/*react*/}

Funzionalità React programmatiche:

<<<<<<< HEAD
* [Hooks](/reference/react/hooks) - Utilizza diverse funzionalità di React dai tuoi componenti.
* [Componenti](/reference/react/components) - Documenta i componenti integrati che puoi utilizzare nel tuo JSX.
* [API](/reference/react/apis) - API utili per la definizione dei componenti.
* [Direttive](/reference/rsc/directives) - Fornisce istruzioni ai bundler compatibili con React Server Components.
=======
* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/rsc/directives) - Provide instructions to bundlers compatible with React Server Components.
>>>>>>> c2d61310664cc0d94f89ca21fc1d44e674329799

## React DOM {/*react-dom*/}

React-dom contiene funzionalità supportate solo per le applicazioni web (che vengono eseguite nell'ambiente DOM del browser). Questa sezione è suddivisa come segue:

* [Hooks](/reference/react-dom/hooks) - Hooks per le applicazioni web che vengono eseguite nell'ambiente DOM del browser.
* [Componenti](/reference/react-dom/components) - React supporta tutti i componenti HTML e SVG integrati nel browser.
* [API](/reference/react-dom) - Il pacchetto `react-dom` contiene metodi supportati solo nelle applicazioni web.
* [API del client](/reference/react-dom/client) - Le API `react-dom/client` ti consentono di renderizzare i componenti React sul client (nel browser).
* [API del server](/reference/react-dom/server) - Le API `react-dom/server` ti consentono di renderizzare i componenti React in HTML sul server.

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}

* [API Legacy](/reference/react/legacy) - Esportate dal pacchetto `react`, ma non consigliate per l'uso in codice appena scritto.
