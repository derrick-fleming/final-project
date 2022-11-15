import React from 'react';
import defaultStates from '../lib/defaultStateCount';
import * as topojson from 'topojson-client';
import Container from 'react-bootstrap/Container';

const d3 = window.d3;

export default class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: 1
    };
    this.renderInforgraphic = this.renderInforgraphic.bind(this);
    this.infographicMap = React.createRef();
  }

  componentDidMount() {
    const { accountId } = this.state;
    fetch(`/api/accounts/${accountId}`)
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          const stateCode = element.stateCode;
          if (defaultStates[stateCode]) {
            defaultStates[stateCode].visits = element.visits;
          }
        });
        this.renderInforgraphic();
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
      .domain([1, 12])
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
              .style('box-shadow', '1px 1px 0.5rem black');

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
              .html(`<h6>${d.properties.name}</h6>
              <h6> Number of visits: <span class="gold">${dataObject[d.properties.name]}</span></h6>`)
              .style('left', (event.layerX) + 'px')
              .style('top', (event.layerY) + 'px')
              .style('transform', offset);
          });
      });

    return svg.node();
  }

  render() {
    return (
      <Container>
        <div id="map" ref={this.infographicMap}/>
      </Container>
    );
  }
}
