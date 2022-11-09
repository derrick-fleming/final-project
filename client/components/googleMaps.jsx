import React from 'react';
/* import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.GOOGLE_API,
  version: 'weekly',
  libraries: ['places', 'marker', 'drawing']
});
*/
export default class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this.googleMapDiv = React.createRef();
  }

  render() {
    return (
      <div
        className='google-map'
        ref={this.googleMapDiv} />
    );
  }
}
