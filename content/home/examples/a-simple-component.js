class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Ciao {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Claudia" />,
  document.getElementById('hello-example')
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
