class HelloMessage extends React.Component {
  render() {
    return <div>Ciao {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Claudia" />);
