import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const MiniOfflineSign = () => {
  
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>You are offline</Text>
    </View>
  );
}
export default MiniOfflineSign;

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#757575',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    marginLeft:'15%',
    marginRight:'15%',
    position: 'absolute',
    bottom:'0%',
    borderRadius:10
  },
  offlineText: { color: '#fff' }
});