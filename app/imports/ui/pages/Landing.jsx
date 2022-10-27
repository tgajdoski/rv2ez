/* eslint-disable no-loop-func */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-new */
import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import polyline from 'google-polyline';
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

  const PolygonArray = (latitude) => {
    const R = 6378137;
    const pi = 3.14;
    // distance in meters
    const upper_offset = 30000;
    const lower_offset = -30000;
    const Lat_up = upper_offset / R;
    const Lat_down = lower_offset / R;
    // OffsetPosition, decimal degrees
    const lat_upper = latitude + (Lat_up * 180) / pi;
    const lat_lower = latitude + (Lat_down * 180) / pi;
    return [lat_upper, lat_lower];
  };

  function PolygonPoints(waypoints) {
    const polypoints = waypoints;
    const PolyLength = polypoints.length;
    const UpperBound = [];
    const LowerBound = [];
    for (let j = 0; j <= PolyLength - 1; j++) {
      const NewPoints = PolygonArray(polypoints[j][0]);
      UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
      LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });
    }
    const reversebound = LowerBound.reverse();
    const FullPoly = UpperBound.concat(reversebound);
    return FullPoly;
  }

  const renderMarkers = (map, maps, res) => {

    const infowindow = new google.maps.InfoWindow({
      content: res.name,
      ariaLabel: res.name,
    });

    const marker = new maps.Marker({
      position: res.geometry.location,
      map,
      title: res.name,
    });

    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
    return marker;
  };

  const handleDirections = async () => {
    if (start && destination && directionsRenderer) {
      const org = { lat: start.latitude, lng: start.longitude || 0 };
      const dest = { lat: destination.latitude, lng: destination.longitude };
      const directions = await getRoute(org, dest);
      directionsRenderer.setMap(mapReference);
      directionsRenderer.setDirections(directions);

      // directions have result of direction points
      const waypoints = polyline.decode(directions.routes[0].overview_polyline);

      // // draw poligon around direction points
      // const PolygonCoords = PolygonPoints(waypoints);
      // const PolygonBound = new google.maps.Polygon({
      //   paths: PolygonCoords,
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: '#FF0000',
      //   fillOpacity: 0.35,
      // });
      //   // to hide polygon set strokeOpacity and fillColor = 0
      // PolygonBound.setMap(mapReference);
      // directionsRenderer.setMap(mapReference);

      const service = new google.maps.places.PlacesService(mapReference);
      for (let j = 0; j < waypoints.length; j += 50) {
        service.nearbySearch({
          location: { lat: waypoints[j][0], lng: waypoints[j][1] },
          radius: '20000',
          type: ['campground'],
        }, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {

            for (let i = 0; i < results.length; i++) {
              console.log('ONE MARKER', results[i]);
              renderMarkers(mapReference, mapsReference, results[i]);
            }
          }
        });

      }

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
    <Container id="landing-page" fluid className="py-1">

      <Row className="align-middle text-right">
        <div className="d-flex flex-row bd-highlight mb-1">
          <div className="d-flex flex-row bd-highlight">
            <label htmlFor="from-search">Start:</label>
            <SearchBar id="from-search" onSelected={handleStartSelection} onChanged={handleStartChange} />
          </div>
          <div className="d-flex flex-row bd-highlight ms-2">
            <label htmlFor="from-search">Destination:</label>
            <SearchBar id="from-search" onSelected={handleDestinationSelection} onChanged={handleDestinationChange} className="child inline-block-child" />
          </div>
          <div className="d-flex flex-row bd-highlight ms-2">
            <label htmlFor="from-search">Radius:</label>
            <input placeholder="30" />
          </div>
        </div>

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
