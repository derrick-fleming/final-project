import React from 'react';
import defaultStates from '../lib/defaultStateCount';
import * as topojson from 'topojson-client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const d3 = window.d3;

export default class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: 1,
      isLoading: true
    };
    this.renderInforgraphic = this.renderInforgraphic.bind(this);
    this.infographicMap = React.createRef();
  }

  componentDidMount() {
    const { accountId } = this.state;
    fetch(`/api/accounts/${accountId}`)
      .then(response => response.json())
      .then(result => {
        if (result[0].length !== 0) {
          result[0].forEach(element => {
            const stateCode = element.stateCode;
            if (defaultStates[stateCode]) {
              defaultStates[stateCode].visits = element.visits;
            }
          });
          this.renderInforgraphic();
          this.setState({
            results: result[0],
            total: result[1][0].reviews
          });
        } else {
          this.renderInforgraphic();
          this.setState({
            results: null,
            total: 'N/A'
          });
        }
      })
      .catch(err => console.error(err));
  }

  renderInforgraphic() {
    const dataObject = {};
    for (const key in defaultStates) {
      const stateName = defaultStates[key].name;
      const visits = defaultStates[key].visits;
      dataObject[stateName] = Number(visits);
    }
    const color = d3.scaleQuantize()
      .domain([1, 15])
      .range(d3.schemeGreens[9]);

    const path = d3.geoPath();
    const svg = d3.select('#map')
      .append('svg')
      .attr('viewBox', '0 0 975 610');

    const toolTip = d3.select('#map')
      .append('div')
      .style('position', 'absolute')
      .attr('class', 'tooltip');

    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json')
      .then(us => {
        svg.append('g')
          .selectAll('path')
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append('path')
          .attr('d', path)
          .attr('class', 'states')
          .style('fill', d => color(dataObject[d.properties.name]))
          .style('stroke', '#636363');

        svg.selectAll('path')
          .on('mouseover', function (event, d) {
            d3.selectAll('.states')
              .transition()
              .duration(200)
              .style('stroke-width', '1px')
              .style('opacity', 0.8)
              .style('box-shadow', '2px 2px 0.5rem black');

            d3.select(this)
              .transition()
              .duration(200)
              .style('opacity', 1)
              .style('stroke-width', '2px')
              .style('cursor', 'pointer');

            d3.select('.tooltip')
              .style('opacity', 1);

          })
          .on('mouseout', function (event) {
            d3.selectAll('.states')
              .transition()
              .duration(200)
              .style('opacity', 1)
              .style('stroke-width', '1px');

            toolTip.style('opacity', 0);
          })
          .on('mousemove', function (event, d) {
            const offsetX = event.layerX > parent.innerWidth * 0.5 ? '-105%' : '5%';
            const offsetY = event.layerY > parent.innerWidth * 0.5 ? '-105%' : '5%';
            const offset = `translate(${offsetX}, ${offsetY})`;

            toolTip
              .html(`<h6 class='open-sans mb-0 mt-2'>${d.properties.name}</h6>
              <p class='open-sans fw-light'> Number of visits: <span class='fw-bold'>${dataObject[d.properties.name]}</span></p>`)
              .style('left', (event.layerX) + 'px')
              .style('top', (event.layerY) + 'px')
              .style('transform', offset);
          });
      });

    return svg.node();

  }

  render() {
    let mostVisited = 'N/A';
    let statesNeeded = 'N/A';
    if (this.state.results) {
      const sqlData = this.state.results;
      const total = sqlData.length;
      statesNeeded = 50 - total;
      if (sqlData.length > 0) {
        const stateCode = sqlData[0].stateCode;
        mostVisited = Object.values(defaultStates[stateCode].name);
      }
    }
    return (
      <>
        <div className='mb-4 position-relative hero-background text-center'>
          <img src='images/joshua-tree.png' alt='Mountain view with lake' className='hero-image' />
          <h2 className='w-100 merriweather fw-bold position-absolute top-50 start-50 translate-middle text-white'><span className='fa-solid fa-map pe-2' />States Tracker</h2>
        </div>
        <Container>
          <Row className='my-4 justify-content-center'>
            <Col xs={12}>
              <h2 className='merriweather text-center'>Places you&apos;ve visited</h2>
            </Col>
            <Col lg={9}>
              <div id="map" ref={this.infographicMap} />
            </Col>
          </Row>
          <Row className='justify-content-end'>
            <Col xs={7} md={4} lg={5} xl={4}>
              <table className='text-center bg-light rounded'>
                <thead>
                  <tr>
                    <th colSpan="12" className='merriweather lh-lg pt-2 fs-6 fw-light'> Total Parks Visited
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='scale'>
                    <td />
                    <td className='zero' />
                    <td className='one' />
                    <td className='two' />
                    <td className='three' />
                    <td className='four' />
                    <td className='five' />
                    <td className='six' />
                    <td className='seven' />
                    <td className='eight' />
                    <td className='nine' />
                    <td />
                  </tr>
                  <tr className='scale open-sans fw-light'>
                    <td />
                    <td>0</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>15+</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col lg={9} className='my-4'>
              <h4 className='merriweather'>Your Statistics</h4>
              <h6 className='open-sans fw-light lh-lg'>Total number of parks visited: <span className='fw-bold'>{this.state.total}</span></h6>
              <h6 className='open-sans fw-light lh-lg'>Most visited state&apos;s parks: <span className='fw-bold'>{mostVisited}</span></h6>
              <h6 className='open-sans fw-light lh-lg'>Number of states left to visit: <span className='fw-bold'>{statesNeeded}</span></h6>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
