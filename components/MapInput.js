import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ENV from '../screens/env';
import Global from '../screens/Global';

class MapInput extends React.Component {

    render() {
        return (
            <GooglePlacesAutocomplete
                placeholder='Enter Search Location'
                minLength={2}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    this.props.notifyChange(details.geometry.location);
                    Global.LocationAddress = data.description;
                }}
                query={{
                    key: ENV.googleApiKey,
                    language: 'en'
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
                style={{ backgroundColor: 'white', position: 'absolute', marginTop: '13%' }}
            />
        );
    }
}

export default MapInput;