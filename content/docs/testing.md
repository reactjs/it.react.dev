---
id: testing
title: Panoramica dei test
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Puoi testare i componenti di React in modo simile al test di altro codice JavaScript.

Ci sono alcuni modi per testare i componenti di React. In linea di massima si dividono in due categorie:

* **Rendering degli alberi dei componenti** in un ambiente di test semplificato e affermando sul loro output.
* **Esecuzione di un'app completa** in un ambiente browser realistico (noto anche come test "end-to-end").

Questa sezione della documentazione si concentra sulle strategie di test per il primo caso. Sebbene i test end-to-end completi possano essere molto utili per prevenire regressioni a flussi di lavoro importanti, tali test non riguardano in particolare i componenti di React e non rientrano nell'ambito di questa sezione.

### Compromessi {#tradeoffs}


Quando si scelgono gli strumenti di test, vale la pena considerare alcuni compromessi:

* **Velocità di iterazione vs ambiente realistico:** Alcuni strumenti offrono un ciclo di feedback molto rapido tra la modifica e la visualizzazione del risultato, ma non modellano con precisione il comportamento del browser. Altri strumenti potrebbero utilizzare un ambiente browser reale, ma riducono la velocità di iterazione e sono più fragili su un server di integrazione continua.
* **Quanto prendere in giro:** Con i componenti, la distinzione tra test "unità" e "integrazione" può essere sfocata. Se stai testando un modulo, il suo test dovrebbe testare anche i pulsanti al suo interno? Oppure un componente pulsante dovrebbe avere una propria suite di test? Il refactoring di un pulsante dovrebbe mai interrompere il test del modulo?

Risposte diverse possono funzionare per team e prodotti diversi.

### Strumenti consigliati {#tools}

**[Jest](https://facebook.github.io/jest/)** è un test runner JavaScript che ti consente di accedere al DOM tramite [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Sebbene jsdom sia solo un'approssimazione di come funziona il browser, spesso è abbastanza buono per testare i componenti di React. Jest offre una grande velocità di iterazione combinata con potenti funzionalità come il mocking [modules](/docs/testing-environments.html#mocking-modules) e [timers](/docs/testing-environments.html#mocking-timers) così puoi avere un maggiore controllo su come viene eseguito il codice.

**[Libreria di test React](https://testing-library.com/react)** è un insieme di helper che ti permettono di testare i componenti di React senza fare affidamento sui loro dettagli di implementazione. Questo approccio rende il refactoring un gioco da ragazzi e ti spinge anche verso le migliori pratiche per l'accessibilità. Anche se non fornisce un modo per "shallowly" enderizza un componente senza i suoi figli, un test runner come Jest ti consente di farlo da [mocking](/docs/testing-recipes.html#mocking-modules).

### Per saperne di più {#learn-more}

Questa sezione è divisa in due pagine:

- [Recipes](/docs/testing-recipes.html): Pattern comuni durante la scrittura di test per i componenti di React.
- [Environments](/docs/testing-environments.html): Cosa considerare quando si configura un ambiente di test per i componenti di React.
