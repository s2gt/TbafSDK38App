import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Global from '../screens/Global';

function ChangeLocation() {
  return (
    <View style={styles.changeLocationStyles}>
      <Icon name='location-on' size={28} color='red' />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: 'red' }} numberOfLines={1}>
        {
          Global.LocationAddress != '' ? Global.LocationAddress : 'Change Location'
        }
      </Text>
    </View>
  )
}
export default ChangeLocation;

const styles = StyleSheet.create({
  changeLocationStyles: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%'
  }
})