import React from 'react';
import ReactDOM from 'react-dom';

const numeri = [1, 2, 3, 4, 5];
const lista = numeri.map((numero) =>
  <li>{numero}</li>
);

ReactDOM.render(
  <ul>{lista}</ul>,
  document.getElementById('root')
);
