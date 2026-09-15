---
title: Warning di deprecazione react-dom/test-utils
translationStatus: ai-draft
---

<Note>

Questa pagina è stata tradotta automaticamente e supervisionata da un maintainer. Un'ulteriore revisione da parte della community sarebbe comunque utile. [Migliora questa traduzione](https://github.com/reactjs/it.react.dev/edit/main/src/content/warnings/react-dom-test-utils.md).

</Note>

## ReactDOMTestUtils.act() warning {/*reactdomtestutilsact-warning*/}

`act` da `react-dom/test-utils` è deprecato in favore di `act` da `react`.

Prima:

```js
import {act} from 'react-dom/test-utils';
```

Dopo:

```js
import {act} from 'react';
```

## Resto delle API ReactDOMTestUtils {/*rest-of-reactdomtestutils-apis*/}

Tutte le API tranne `act` sono state rimosse.

Il team React consiglia di migrare i tuoi test a [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) per un'esperienza di testing moderna e ben supportata.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` può essere sostituito con `render` da `@testing-library/react`.

Prima:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

Dopo:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` può essere sostituito con `fireEvent` da `@testing-library/react`.

Prima:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

Dopo:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Tieni presente che `fireEvent` invia un evento reale sull'elemento e non chiama solo sinteticamente il gestore di eventi.

### Elenco di tutte le API rimosse {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
