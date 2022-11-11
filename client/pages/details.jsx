import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default class ParkDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { name, wikiImage, description } = this.props.info;
    return (
      <Container>
        <Row>
          <h3>{name}</h3>
        </Row>
        <Row>
          <img src={wikiImage} alt={name} />
        </Row>
        <Row>
          <p>{description}</p>
        </Row>
      </Container>
    );
  }
}
