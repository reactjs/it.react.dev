# it.reactjs.org 🇮🇹

Questo archivio contiene il codice sorgente e la documentazione di [it.reactjs.org](https://it.reactjs.org/).

[![CircleCI](https://circleci.com/gh/reactjs/it.reactjs.org.svg?style=svg)](https://circleci.com/gh/reactjs/it.reactjs.org)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c1ab8437-37e4-47bb-8ce8-59c03e7d70ae/deploy-status)](https://app.netlify.com/sites/it-react-org/deploys)

> 👀 Anteprima: https://it-react-org.netlify.com/

## Prima di iniziare, alcuni link utili:

- [Glossario](GLOSSARY.md)
- [Guida degli stili](STYLE_GUIDE.md)

## Primi passi

### Prerequisiti

1. Git
1. Node: qualsiasi versione 12.x iniziando dalla v12.0.0 o superiore
1. Yarn: vai al [sito di Yarn per le istruzioni di installazione](https://yarnpkg.com/lang/en/docs/install/)
1. Un fork dell'archivio (per qualsiasi contribuzione)
1. Un clone di [reactjs.org repo](https://github.com/reactjs/reactjs.org) sul tuo computer

### Installazione

1. `cd reactjs.org` per andare alla radice del progetto
1. `yarn` per installare le dipendenze di npm nel sito

### Eseguire localmente

1. `yarn dev` per iniziare il server hot-reloading di sviluppo (offerto da [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` per aprire il sito nel tuo browser preferito

## Contribuire

### Linee guida

La documentazione é divisa in diverse sezioni con differenti toni e propositi. Se sei intenzionato a scriverre piu di qualche linea, postrebbe esserti utile per famigliarizzare con le [linee guida per contribuire](https://github.com/reactjs/reactjs.org/blob/master/CONTRIBUTING.md#guidelines-for-text) per la sezione appropriata.

### Creare un branch

1. `git checkout master` da qualsiasi cartella nel tuo archivio locale di `reactjs.org` 
1. `git pull origin master` per assicurarti di avere il codige aggiornato
1. `git checkout -b the-name-of-my-branch` (rinominare `the-name-of-my-branch` con un nom adatto) per creare un branch

### Apportare una modifica

1. Segui le istruzioni di ["Eseguire localmente"](#running-locally) 
1. Salva i file e controlla nel browser
  1. Qualsisi cambiamento di un componente in `src` fará ricaricare la pagina
  1. Quasiasi cambio i markdown in `content` fará ricaricare la pagina
  1. Se stai lavorando con plugins, potresti aver bisogno di rimuovere l'archivio `.cache` e reiniziare il server

### Testare il cambio

1. Se é possibile, testa ogni cambio visuale in tutti i browser piu comuni, alla ultima versione, sia in desktop che in mobile.
1. Esegui `yarn check-all` dalla radice del progetto. (Questo esecuterá Prettier, ESLint, e Flow.)

### Pubblicalo

1. `git add -A && git commit -m "My message"` (sostituire `My message` con un messaggio del commit, come per esempio "Fix del logo nell'header su Android"per far stage e commit dei tuoi cambi.
1. `git push my-fork-name the-name-of-my-branch`
1. Vai all'[archivio reactjs.org](https://github.com/reactjs/reactjs.org) e dovresti vedere le branch pubblicate recentemente.
1. Segui le instruzioni di GitHub.
1. Se fosse possibile, aggiungere uno screenshot dei cambi. Inoltre si creerá automaticamente un Netlify build quando farai una PR, cosí che altre persone possano vedere i tuoi cambi.

## Traduzione

Se sei interessato a tradurre `reactjs.org`, per favore invia la traduzione a [isreacttranslatedyet.com](https://www.isreacttranslatedyet.com/).


Se la tua lingua non ha una traduzione e vuoi crearne una, per favore segui le istruzioni su [Traduzioni reactjs.org](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Risoluzione dei problemi

- `yarn reset` pr pulire la cache locale

## Licenza
Il materiale inviato a [reactjs.org](https://reactjs.org/) ha una licenza CC-BY-4.0, come citato nel file [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md)
