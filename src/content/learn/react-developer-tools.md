---
title: React Developer Tools
---

<Intro>

Usa React Developer Tools per ispezionare i [componenti](/learn/your-first-component) React, modificare le [props](/learn/passing-props-to-a-component) e lo [stato](/learn/state-a-components-memory), e identificare problemi di performance.

</Intro>

<YouWillLearn>

* Come installare React Developer Tools

</YouWillLearn>

## Estensione del browser {/*browser-extension*/}

Il modo più facile per effettuare il debug di siti web costruiti con React è installare l'estensione per browser React Developer Tools. È disponibile per molti browser popolari:

* [Installa per **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=it)
* [Installa per **Firefox**](https://addons.mozilla.org/it/firefox/addon/react-devtools/)
* [Installa per **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Adesso, se visiti un sito web **costruito con React,** vedrai i pannelli _Components_ e _Profiler_.

![Estensione React Developer Tools](/images/docs/react-devtools-extension.png)

### Safari e altri browser {/*safari-and-other-browsers*/}
Per altri browser (ad esempio, Safari), installa il pacchetto npm [`react-devtools`](https://www.npmjs.com/package/react-devtools):
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Successivamente, apri i developer tools dal terminale:
```bash
react-devtools
```

Poi, connetti il tuo sito web aggiungendo il seguente tag `<script>` all'inizio dell'`<head>`:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Adesso, aggiorna il tuo sito web nel browser per visualizzarlo nei developer tools.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
React Developer Tools si può anche usare per ispezionare app costruite con [React Native](https://reactnative.dev/).

Il modo più facile per usare React Developer Tools è installarlo globalmente:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Successivamente, apri i developer tools dal terminale.
```bash
react-devtools
```

Dovrebbe connettersi ad una qualsiasi app React Native locale in esecuzione.

> Prova a ricaricare l'app se developer tools non si connette dopo alcuni secondi.

[Ulteriori informazioni sul debugging di React Native](https://reactnative.dev/docs/debugging)
