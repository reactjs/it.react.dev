---
title: Warning di deprecazione react-test-renderer
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/react-test-renderer.md).

</Note>

## Warning ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

react-test-renderer è deprecato. Un warning viene mostrato ogni volta che chiami `ReactTestRenderer.create()` o `ReactShallowRender.render()`. Il pacchetto react-test-renderer resterà disponibile su NPM ma non sarà mantenuto e potrebbe rompersi con nuove funzionalità di React o modifiche agli internals di React.

Il team React consiglia di migrare i tuoi test a [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) o [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) per un'esperienza di testing moderna e ben supportata.


## Warning new ShallowRenderer() {/*new-shallowrenderer-warning*/}

Il pacchetto react-test-renderer non esporta più uno shallow renderer in `react-test-renderer/shallow`. Era semplicemente un reimpacchettamento di un pacchetto separato estratto in precedenza: `react-shallow-renderer`. Puoi quindi continuare a usare lo shallow renderer nello stesso modo installandolo direttamente. Vedi [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
