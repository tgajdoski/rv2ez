import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import SearchBar from '../components/SearchBar';

const Landing = () => {
  const [mapReference, setMapReference] = useState(null);
  const [mapsReference, setMapsReference] = useState(null);
  const [start, setStart] = useState(undefined);
  const [destination, setDestination] = useState(undefined);
  const [directionsRenderer, setDirectionsRenderer] = useState(undefined);

  async function getRoute(org, dest) {
    return new Promise(function (resolve, reject) {
      const directionsService = new mapsReference.DirectionsService();
      directionsService.route(
        {
          origin: org,
          destination: dest,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            resolve(result);
          } else {
            reject(result);
          }
        },
      );
    });
  }

  const handleDirections = async () => {
    if (start && destination && directionsRenderer) {
      const org = { lat: start.latitude, lng: start.longitude || 0 };
      const dest = { lat: destination.latitude, lng: destination.longitude };
      const directions = await getRoute(org, dest);

      directionsRenderer.setMap(mapReference);
      directionsRenderer.setDirections(directions);
    }
  };

  useEffect(() => {
    handleDirections();
  }, [start, destination]);

  const handleStartSelection = (state) => {
    setStart(state);
  };

  const handleDestinationSelection = (state) => {
    setDestination(state);
  };

  const handleStartChange = (state) => {
    setStart(state);
  };

  const handleDestinationChange = (state) => {
    setDestination(state);
  };

  const defaultProps = {
    center: {
      lat: 40.7127753,
      lng: -76.7074571,
    },
    zoom: 7,
  };

  const handleApiLoaded = (map, maps) => {
    setMapReference(map);
    setMapsReference(maps);
  };

  useEffect(() => {
    if (mapsReference) {
      setDirectionsRenderer(new mapsReference.DirectionsRenderer());
    }
  }, [mapsReference, mapReference]);

  return (
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-right">
        <label htmlFor="from-search">
          From:
        </label>
        <SearchBar id="from-search" onSelected={handleStartSelection} onChanged={handleStartChange} />
      </Row>
      <Row className="align-middle text-right">
        <label htmlFor="from-search">
          To:
        </label>
        <SearchBar id="from-search" onSelected={handleDestinationSelection} onChanged={handleDestinationChange} />
      </Row>
      <Row className="align-middle text-center">
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBYxOxFmeIPW8zIkK1LEKPDMnGdSdmUWyg' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          />
        </div>
      </Row>
    </Container>
  );
};

export default Landing;
