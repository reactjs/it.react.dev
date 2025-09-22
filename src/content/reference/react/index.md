---
title: Panoramica della documentazione di React
---

<Intro>

Questa sezione fornisce una documentazione di riferimento dettagliata per lavorare con React. Per una introduzione a React, visita la sezione [Learn](/learn).

</Intro>

La documentazione di riferimento su React è suddivisa in sottosezioni funzionali:

## React {/*react*/}

Funzionalità React programmatiche:

* [Hooks](/reference/react/hooks) - Utilizza diverse funzionalità di React dai tuoi componenti.
* [Componenti](/reference/react/components) - Componenti integrati che puoi utilizzare nel tuo JSX.
* [API](/reference/react/apis) - API utili per la definizione dei componenti.
* [Direttive](/reference/rsc/directives) - Fornisce istruzioni ai bundler compatibili con React Server Components.

## React DOM {/*react-dom*/}

React-dom contiene funzionalità supportate solo per le applicazioni web (che vengono eseguite nell'ambiente DOM del browser). Questa sezione è suddivisa come segue:

* [Hooks](/reference/react-dom/hooks) - Hooks per le applicazioni web che vengono eseguite nell'ambiente DOM del browser.
* [Componenti](/reference/react-dom/components) - React supporta tutti i componenti HTML e SVG integrati nel browser.
* [API](/reference/react-dom) - Il pacchetto `react-dom` contiene metodi supportati solo nelle applicazioni web.
* [API del client](/reference/react-dom/client) - Le API `react-dom/client` ti consentono di renderizzare i componenti React sul client (nel browser).
* [API del server](/reference/react-dom/server) - Le API `react-dom/server` ti consentono di renderizzare i componenti React in HTML sul server.

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}

* [API Legacy](/reference/react/legacy) - Esportate dal pacchetto `react`, ma non consigliate per l'uso in codice appena scritto.
