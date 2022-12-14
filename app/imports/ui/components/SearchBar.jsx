/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable global-require */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from '../place_utils';
import { classnames } from '../helpers';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      errorMessage: '',
      latitude: null,
      longitude: null,
      isGeocoding: false,
    };
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: '',
    }, () => this.props.onChanged(this.state));
  };

  handleSelect = selected => {
    this.setState({ isGeocoding: true, address: selected });
    geocodeByAddress(selected)
      .then(res => getLatLng(res[0]))
      .then(({ lat, lng }) => {
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false,
        }, () => this.props.onSelected(this.state));
      })
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.log('error', error); // eslint-disable-line no-console
      });
  };

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
    }, () => this.props.onChanged(this.state));
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  render() {
    const {
      address,
      errorMessage,
      latitude,
      longitude,
      isGeocoding,
    } = this.state;

    return (
      <div>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
          shouldFetchSuggestions={address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div className="Demo__search-bar-container">
              <div className="Demo__search-input-container">
                <input
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'Demo__search-input',
                  })}
                />
                {this.state.address.length > 0 && (
                  <button
                    className="Demo__clear-button"
                    onClick={this.handleCloseClick}
                  >
                    x
                  </button>
                )}
              </div>
              {suggestions.length > 0 && (
                <div key={suggestions.length} className="Demo__autocomplete-container">
                  {suggestions.map((suggestion, index) => {
                    const className = classnames('Demo__suggestion-item', {
                      'Demo__suggestion-item--active': suggestion.active,
                    });
                    return (
                      <div
                        key="AAAAAAA"
                        {...getSuggestionItemProps(suggestion, { className })}
                      >
                        <strong>
                          {suggestion.formattedSuggestion.mainText}
                        </strong>{' '}
                        <small>
                          {suggestion.formattedSuggestion.secondaryText}
                        </small>
                      </div>
                    );
                    /* eslint-enable react/jsx-key */
                  })}
                </div>
              )}
            </div>
          )}
        </PlacesAutocomplete>
        {errorMessage.length > 0 && (
          <div className="Demo__error-message">{this.state.errorMessage}</div>
        )}

        {((latitude && longitude) || isGeocoding) && (
          <div>
            {isGeocoding ? (
              <div>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" />
              </div>
            ) : (
              <div className="d-flex flex-row bd-highlight mb-1">
                <div className="Demo__geocode-result-item--lat">
                  <label>Latitude:</label>
                  <span>{latitude}</span>
                </div>
                <div className="Demo__geocode-result-item--lng ms-3">
                  <label>Longitude:</label>
                  <span>{longitude}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

SearchBar.propTypes = {
  onSelected: PropTypes.func.isRequired,
  onChanged: PropTypes.func.isRequired,
};

export default SearchBar;
