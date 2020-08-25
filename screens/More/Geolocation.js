import React from 'react';
import {
  View, StyleSheet, Button, ScrollView, AsyncStorage, Modal,
  TouchableOpacity, Keyboard, Image, Text
} from 'react-native';
import MapInput from '../../components/MapInput';
import MyMapView from '../../components/MapView';
import { getLocation, geocodeLocationByName } from '../Services/location-service';
import Global from '../Global';
import LanguageScreen from '../Home/LanguageScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import PoweredByLogo from '../../components/PoweredByLogo';


class MapContainer extends React.Component {
  state = {
    region: {},
    modalVisible: false,
  };

  componentDidMount() {
    this.getInitialState();
  }

  getInitialState() {
    getLocation().then(
      (data) => {
        this.setState({
          region: {
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
          }
        }, () => {
        });
      }
    );
  }

  getCoordsFromName(loc) {
    this.setState({
      region: {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003
      }
    });
    this.setState({ modalVisible: false })
  }

  onMapRegionChange(region) {
    this.setState({ region });
  }

  onNavigateToLang() {
    Global.Latitude = this.state.region.latitude;
    Global.Longitude = this.state.region.longitude;
    console.log('lat & long..' + Global.Latitude + ' ' + Global.Longitude)
    if (this.state.region.latitude && this.state.region.longitude) {
      AsyncStorage.setItem('Latitude', JSON.stringify(this.state.region.latitude));
      AsyncStorage.setItem('Longitude', JSON.stringify(this.state.region.longitude));
      this.props.navigation.navigate('LanguageScreen');
    } else {
      alert('Please select your Location');
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}>

          <View style={{ paddingTop: 60 }}>
            <MapInput
              notifyChange={(loc) => this.getCoordsFromName(loc)}
            />
            <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }}
              style={{ position: 'absolute', right: 20, top: 67 }} >
              <Icon name='close' size={25} color='red' />
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={styles.logoStyles}>
          <PoweredByLogo />

          <TouchableOpacity style={styles.removeIconStyles}
            onPress={() => { this.setState({ modalVisible: true }) }}
            underlayColor='transparent'>
            <View>
              <Icon name="search" size={30} color="#9e9e9e" />
            </View>
          </TouchableOpacity>
        </View>
        {
          this.state.region['latitude'] ?
            <MyMapView
              region={this.state.region}
              onRegionChange={(reg) => this.onMapRegionChange(reg)} />
            :
            null
        }
        <View style={styles.buttonStyle}>
          <Button
            title='Select current Location'
            onPress={() => { this.onNavigateToLang() }}
          />
        </View>
      </View>
    );
  }
}

export default MapContainer;

const styles = StyleSheet.create({
  buttonStyle: {
    margin: '3%',
    paddingBottom: 20,
  },
  logoStyles: {
    alignItems: 'center',
    marginTop: '8%',
    marginBottom: '2%',
  },
  removeIconStyles: {
    alignSelf: 'flex-end',
    marginTop: '2%',
    marginRight: '5%',
    position: 'absolute',
  }
});