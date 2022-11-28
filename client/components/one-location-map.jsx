import React from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import escape from 'escape-html';

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'marker', 'drawing']
});

export default class SinglePointMap extends React.Component {
  constructor(props) {
    super(props);
    this.googleMapDiv = React.createRef();
    this.createMap = this.createMap.bind(this);
  }

  componentDidMount() {
    this.createMap();
  }

  componentDidUpdate(prevProps) {
    if (this.props.results !== prevProps.results) {
      this.createMap();
    }
  }

  createMap() {
    const park = this.props.results;
    const mapOptions = {
      center: { lat: Number(park.latitude), lng: Number(park.longitude) },
      zoom: 8,
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
    })
      .then(map => {
        if (park.latitude === '' || park.longitude === '') {
          return null;
        }
        const destination = {
          lat: Number(park.latitude),
          lng: Number(park.longitude)
        };
        const marker = new window.google.maps.Marker({
          position: destination,
          map
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content:
                '<h6 class="info-title">' + escape(park.name) + '</h6>' +
                '<p class="info-window mb-0">' + escape(park.addresses[0].line1) + '</p>' +
                '<p class="info-window gold fw-bold">' + escape(park.addresses[0].city) + escape(', ') + escape(park.addresses[0].stateCode) + escape(' ') + escape(park.addresses[0].postalCode) + '</p>',
          maxWidth: 250,
          ariaLabel: park.name
        });
        marker.addListener('click', () => {
          infoWindow.open(marker.getMap(), marker);
          map.setCenter(marker.getPosition());
          map.setZoom(10);
        });
        map.addListener('click', () => {
          infoWindow.close();
          map.setZoom(8);
        });
        marker.setMap(map);
        window.addEventListener('resize', () => {
          map.getCenter();
        });
        map.getCenter();
      });
  }

  render() {
    return (
      <div
      className='google-map w-100 p-2 rounded shadow-sm'
      ref={this.googleMapDiv} />
    );
  }
}
