import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const MyMapView = (props) => {
  return (
    <MapView
      style={styles.mapStyle}
      region={props.region}
      showsUserLocation={true}
      onRegionChangeComplete={(reg) => props.onRegionChange(reg)}
      zoomControlEnabled={false}>

      <Marker coordinate={props.region} />
    </MapView>
  )
}

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default MyMapView;