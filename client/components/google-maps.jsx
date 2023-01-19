import React from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import escape from 'escape-html';

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'marker', 'drawing']
});

export default class GoogleMaps extends React.Component {
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

  async createMap() {
    const states = this.props.results;
    const mapOptions = {
      center: { lat: 37.0902, lng: -95.7129 },
      zoom: 4,
      streetViewControl: false,
      mapTypeControl: false
    };
    try {
      const google = await loader.load();
      const map = this.map = await new window.google.maps.Map(this.googleMapDiv.current, mapOptions);
      this.setState({
        google,
        map
      });
      if (states.length === 0) {
        return;
      }
      const bound = new window.google.maps.LatLngBounds();

      states.forEach(state => {
        if (state.latitude === '' || state.longititude === '') {
          return null;
        }
        const destination = {
          lat: Number(state.latitude),
          lng: Number(state.longitude)
        };
        bound.extend(new window.google.maps.LatLng(destination));
        const marker = new window.google.maps.Marker({
          position: destination,
          map
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content:
            '<h6 class="info-title">' + escape(state.name) + '</h6>' +
            '<p class="info-window mb-0">' + escape(state.addresses[0].line1) + '</p>' +
            '<p class="info-window gold fw-bold">' + escape(state.addresses[0].city) + escape(', ') + escape(state.addresses[0].stateCode) + escape(' ') + escape(state.addresses[0].postalCode) + '</p>',
          maxWidth: 250,
          ariaLabel: state.name
        });
        marker.addListener('click', () => {
          infoWindow.open(marker.getMap(), marker);
          map.setCenter(marker.getPosition());
          map.setZoom(6);
        });
        map.addListener('click', () => {
          infoWindow.close();
          map.setZoom(4);
          map.fitBounds(bound);
          map.getCenter();
        });
        marker.setMap(map);
      });
      window.addEventListener('resize', () => {
        map.fitBounds(bound);
      });
      map.fitBounds(bound);
      map.getCenter();
    } catch (err) {
      console.error(err);
    }
  }

  /*
    loader.load().then(google => {
      const map = this.map = new window.google.maps.Map(this.googleMapDiv.current, mapOptions);
      this.setState({
        google,
        map
      });
      return map;
    })
      .then(map => {
        if (states.length !== 0) {
          const bound = new window.google.maps.LatLngBounds();

          states.forEach(state => {
            if (state.latitude === '' || state.longititude === '') {
              return null;
            }
            const destination = {
              lat: Number(state.latitude),
              lng: Number(state.longitude)
            };
            bound.extend(new window.google.maps.LatLng(destination));
            const marker = new window.google.maps.Marker({
              position: destination,
              map
            });
            const infoWindow = new window.google.maps.InfoWindow({
              content:
                '<h6 class="info-title">' + escape(state.name) + '</h6>' +
                '<p class="info-window mb-0">' + escape(state.addresses[0].line1) + '</p>' +
                '<p class="info-window gold fw-bold">' + escape(state.addresses[0].city) + escape(', ') + escape(state.addresses[0].stateCode) + escape(' ') + escape(state.addresses[0].postalCode) + '</p>',
              maxWidth: 250,
              ariaLabel: state.name
            });
            marker.addListener('click', () => {
              infoWindow.open(marker.getMap(), marker);
              map.setCenter(marker.getPosition());
              map.setZoom(6);
            });
            map.addListener('click', () => {
              infoWindow.close();
              map.setZoom(4);
              map.fitBounds(bound);
              map.getCenter();
            });
            marker.setMap(map);
          });
          window.addEventListener('resize', () => {
            map.fitBounds(bound);
          });
          map.fitBounds(bound);
          map.getCenter();
        }
      })
      .catch(err => console.error(err));
  }
*/
  render() {
    return (
      <div
      className='google-map w-100 p-2 rounded shadow-sm'
      ref={this.googleMapDiv} />
    );
  }
}
