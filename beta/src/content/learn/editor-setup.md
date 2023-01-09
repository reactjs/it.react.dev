---
title: Editor Setup
---

<Intro>

<<<<<<< HEAD
Un editor correttamente configurato permette una più facile lettura del codice ed una scrittura più veloce. Può anche aiutare nell'individuazione di bugs durante la battitura! Se è la prima volta che configuri un editor o vuoi ritoccare la tua configurazione attuale, abbiamo alcune raccomandazioni.
=======
A properly configured editor can make code clearer to read and faster to write. It can even help you catch bugs as you write them! If this is your first time setting up an editor or you're looking to tune up your current editor, we have a few recommendations.
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0

</Intro>

<YouWillLearn>

* Quali sono gli editor più comuni
* Come formattare automaticamente il codice

</YouWillLearn>

## Il tuo editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) è uno degli editor più popolari al momento. Ha un grande marketplace di estensioni e si integra molto bene con servizi popolari come GitHub. Molte delle funzioni elencate di seguito possono essere aggiunte a VS Code come estensioni, rendendolo altamente configurabile!

Altri editor di testo popolari in uso nella comunità React sono:

* [WebStorm](https://www.jetbrains.com/webstorm/) che è un ambiente integrato di sviluppo progettato specificatamente per JavaScript.
* [Sublime Text](https://www.sublimetext.com/) offre supporto JSX e TypeScript, [evidenziazione della sintassi](https://stackoverflow.com/a/70960574/458193) e autocompletamento.
* [Vim](https://www.vim.org/) è un editor di testo altamente configurabile progettato per rendere la modifica di ogni tipo di testo molto efficiente. É incluso nella maggioranza delle distribuzioni UNIX e Apple OS X lanciando il comando "vi".

## Funzioni degli editor di testo raccomandate {/*recommended-text-editor-features*/}

Alcuni editor hanno queste funzioni già incluse, altri potrebbero richiedere l'installazione di una estensione. Verifica cosa è supportato dal tuo editor preferito per sicurezza!

### Linting {/*linting*/}

I code linters individuano problemi nel codice man mano che lo si scrive, permettendo di fixarli sul nascere. [ESLint](https://eslint.org/) è un linter per JavaScript open source molto popolare.

* [Installa ESLint con la configurazione raccomandata per React](https://www.npmjs.com/package/eslint-config-react-app) (accertati di avere [Node installato!](https://nodejs.org/en/download/current/))
* [Integra ESLint in VSCode con l'estensione ufficiale](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Accertati di aver attivato tutte le regole [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) per il tuo progetto.** Sono essenziali per individuare gravi bugs al più presto possibile. Il preset raccomandato [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) le include già.

### Formattazione {/*formatting*/}

L'ultima cosa che vuoi avere quando condividi il tuo codice con un altro collaboratore è una discussione riguardo [tabs contro spazi](https://www.google.com/search?q=tabs+vs+spaces)! Fortunatamente, [Prettier](https://prettier.io/) ripulirà il tuo codice riformattandolo conformemente ad una configurazione presettata. Esegui Prettier, e tutti i tuoi tabs verranno convertiti in spazi e la tua indentazione, virgolette, ecc verranno cambiate a seconda della configurazione. Nel setup ideale, ogni volta che salvi un file, Prettier applicherà queste modifiche per conto tuo automaticamente.

Puoi installare l'[estensione Prettier in VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) seguendo questi passi:

1. Lancia VS Code
2. Usa `Quick Open` (premendo Ctrl/Cmd+P)
3. Incolla `ext install esbenp.prettier-vscode`
4. Premi Invio

#### Formattazione automatica al salvataggio del file {/*formatting-on-save*/}

Idealmente, dovresti riformattare il tuo codice ad ogni salvataggio. VS Code ha un settaggio apposito!

1. In VS Code, premi `CTRL/CMD + SHIFT + P`.
2. Scrivi "settings"
3. Premi Invio
4. Nella barra di ricerca, scrivi "format on save"
5. Accertati che l'opzione "format on save" sia selezionata!

> Se il tuo preset ESLint ha regole di formattazione, potrebbero andare in conflitto con Prettier. Ti raccomandiamo di disabilitare tutte le regole di formattazione nel tuo preset ESLint usando [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) facendo si che ESLint venga usato *solo* per identificare errori. Se vuoi fare in modo che la formattazione sia forzata prima che una pull request sia "merged", usa [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) nella tua pipeline di continuous integration.
