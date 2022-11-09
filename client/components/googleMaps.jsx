import React from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.GOOGLE_API,
  version: 'weekly',
  libraries: ['places', 'marker', 'drawing']
});

export default class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this.googleMapDiv = React.createRef();
  }

  componentDidMount() {
    const mapOptions = {
      center: { lat: 37.0902, lng: -95.7129 },
      zoom: 4,
      streetViewControl: false,
      mapTypeControl: false
    };
    loader.load().then(google => {
      const map = this.map = new window.google.maps.Map(this.googleMapDiv.current, mapOptions);
      this.setState({
        google,
        map
      });
      return map;
    });
  }

  render() {
    return (
      <div
      id="the-div"
      className='google-map'
        ref={this.googleMapDiv} />
    );
  }
}
