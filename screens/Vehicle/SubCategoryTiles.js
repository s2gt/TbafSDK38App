import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Config from '../../Config/Config';
import Theme from '../Theme';

export default class SubCategoryTiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtColor: '',
      font: ''
    };
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const {
      name,
      thumbnail,
    } = this.props.result;

    const { itemWidth } = this.props

    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.font = Theme.setFont();
    return (
      <View style={styles.CategoryStyle}>

        <View style={{ height: 150, width: itemWidth, margin: 5 }}>
          <Image source={thumbnail ? {uri: thumbnail } : null} style={{ height: '75%', width: '100%', resizeMode: 'contain' }} />
          <Text style={[styles.tileTextStyles, { fontFamily: this.state.font, color: this.state.txtColor, fontFamily: this.state.font }]} numberOfLines={2}>
            {entities.decode(name)}
          </Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  ModalTitles: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  CategoryStyle: {
    paddingBottom: 3,
  },
  ModalStyles: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
  },
  iconBackStyle: {
    justifyContent: 'center',
    marginLeft: '8%',
    width: '12%'
  },
  tileTextStyles: {
    textAlign: 'center',
    paddingTop: 5,
  }
});