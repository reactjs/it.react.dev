---
id: faq-structure
title: Struttura dei File
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### C'è un modo consigliato per strutturare progetti React? {#is-there-a-recommended-way-to-structure-react-projects}

React non ha opinioni su come organizzi i file nelle cartelle. Detto questo, ci sono alcuni approcci popolari nell'ecosistema che potresti prendere in considerazione.

#### Raggruppamento per funzionalità o percorso {#grouping-by-features-or-routes}

Una modalità comune per strutturare i progetti è posizionare file CSS, JS e i test in cartelle raggruppate per funzionalità o percorso.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

La definizione di "funzionalità" non è universale e sta a te decidere la granularità. Se non riesci ad ottenere una lista di cartelle principali, puoi chiedere agli utenti del tuo prodotto di quali parti è composto principalmente e usare il loro modello mentale come schema.

#### Raggruppamento per tipo di file {#grouping-by-file-type}

Un altro modo popolare per strutturare i progetti è raggruppare file simili, ad esempio:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Alcune persone preferiscono andare ancora oltre e separare i componenti in cartelle diverse a seconda del loro ruolo nell'applicazione. Ad esempio, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) è una metodologia di progettazione costruita su questo principio. Ricorda che spesso è più produttivo trattare queste metodologie come esempi utili piuttosto che come rigide regole da seguire.

#### Evita troppo annidamento {#avoid-too-much-nesting}

Ci sono molti punti deboli associati all'annidamento profondo delle cartelle nei progetti JavaScript. Diventa più difficile scrivere importazioni relative tra di loro, oppure aggiornare queste importazioni quando i file vengono spostati. A meno che tu non abbia una ragione convincente per usare una struttura di cartelle profonda, considera di limitarti a un massimo di tre o quattro cartelle annidate in un singolo progetto. Naturalmente, questa è solo una raccomandazione e potrebbe non essere rilevante per il tuo progetto.

#### Non pensarci troppo {#dont-overthink-it}

Se stai avviando un progetto, [non spendere più di cinque minuti](https://en.wikipedia.org/wiki/Analysis_paralysis) per scegliere una struttura di file. Scegli uno degli approcci qui sopra (o creane uno tuo) e inizia a scrivere codice! Probabilmente vorrai ripensarci comunque dopo aver scritto del codice reale.

Se ti senti completamente bloccato, inizia mantenendo tutti i files in un'unica cartella. Col tempo diventerà abbastanza grande che vorrai separare alcuni file dagli altri. A quel punto avrai abbastanza conoscenze per indicare quali file modifichi insieme più frequentemente. In generale, è una buona idea tenere i file che cambiano spesso insieme uno vicino all'altro. Questo principio è chiamato "colocation".

Man mano che i progetti crescono, nella pratica spesso adottano una combinazione dei due approcci precedenti. Quindi scegliere quello "giusto" all'inizio non è molto importante.
