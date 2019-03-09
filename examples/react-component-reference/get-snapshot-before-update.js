class ListaScorrimento extends React.Component {
  constructor(props) {
    super(props);
    this.rifLista = React.createRef();
  }

  getSnapshotBeforeUpdate(propsPrecedenti, statePrecedente) {
    // Stiamo aggiungendo nuovi elementi alla lista?
    // Salviamo la posizione dello scroll in modo da poterla aggiustare in seguito.
    if (propsPrecedenti.list.length < this.props.list.length) {
      const lista = this.rifLista.current;
      return lista.scrollHeight - lista.scrollTop;
    }
    return null;
  }

  componentDidUpdate(propsPrecedenti, statePrecedente, snapshot) {
    // Se snapshot è definito, abbiamo appenan aggiunto nuovi elementi alla lista.
    // Aggiustiamo lo scroll in modo che i nuovi elementi non spingano quelli
    // preesistenti fuori dallo schermo.
    // (snapshot contiene il valore restituito da getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const lista = this.rifLista.current;
      lista.scrollTop = lista.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.rifLista}>{/* ...contenuti... */}</div>
    );
  }
}
