import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';
import Global from '../Global';
0
export default class StaticPageTile extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      txtColor: '',
      font: ''
    };
  }

  render() {
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    const {
      title,
      name
    } = this.props.result;

    return (
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '95%' }}>
            <Text style={[styles.lineStyles, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
              {title != '' ? title : name}
            </Text>
          </View>
          <View>
            <Icon name='angle-right' size={20} style={styles.forwardIconStyles} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forwardIconStyles: {
    position: "absolute",
    marginTop: '70%',
  },
  lineStyles: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: '5%',
    marginLeft: '3%'
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginLeft: '5%',
    marginRight: '5%',
  }
});