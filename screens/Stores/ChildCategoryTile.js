import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import Config from '../../Config/Config';
import Theme from '../Theme';
import { Card } from 'react-native-cards';
import Icon from 'react-native-vector-icons/FontAwesome';

const BannerWidth = Dimensions.get('window').width;
let BannerHeight = Dimensions.get('window').height / 1.5;

export default class ChildCategoryTile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      txtColor: '',
      font: '',
      titleTxtColor: '',
    };
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const {
      name,
      storeImage,
      categories,
      address,
      homeDelivery,
      pickUp,
      distance,
      ratings,
      timings,
      tagline
    } = this.props.result;
    const { itemWidth } = this.props

    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.font = Theme.setFont();
    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');

    return (
      <Card style={styles.row}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '29%', marginLeft: '1%' }}>
            <Image
              resizeMode='contain'
              source={storeImage ? { uri: storeImage } : null}
              style={{ width: 100, height: 150, marginTop: '-18%' }}
            />
          </View>
          <View style={{ width: '69%', marginLeft: '1%' }}>
            <Text style={[styles.tileTextStyles, {
              fontFamily: this.state.font, color: '#3f51b5'
            }]}
              numberOfLines={5}
            >
              {entities.decode(name)}
            </Text>
            <Text style={{ color: 'red', marginBottom: '1%' }}>{categories}</Text>
            <View style={styles.directionStyles}>
              <View style={styles.directionStyles}>
                <Text style={{ color: 'gray', marginRight: '1%' }}>Home Delivery  </Text>
                {
                  homeDelivery ?
                    <Icon name='check-circle-o' size={18} color='green' /> :
                    <Icon name='times-circle-o' size={18} color='red' />
                }
              </View>
              <Text>       </Text>
              <View style={styles.directionStyles}>
                <Text style={{ color: 'gray', marginRight: '1%' }}>Pick Up  </Text>
                {
                  pickUp ?
                    <Icon name='check-circle-o' size={18} color='green' /> :
                    <Icon name='times-circle-o' size={18} color='red' />
                }
              </View>
            </View>
            <View style={styles.directionStyles}>
              <Text style={{ color: 'gray', fontWeight: 'bold' }}>{distance} km</Text>
              {
                ratings != '' ?
                  <View style={styles.directionStyles}>
                    <Text style={{ fontWeight: 'bold' }}> | </Text>
                    <Icon name='star' size={18} color='gray' />
                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>{ratings}</Text>
                  </View> :
                  null
              }

            </View>
            {
              timings != '' ?
                <View>
                  <Text style={{ color: 'gray', fontWeight: 'bold' }}>{timings}</Text>
                </View> :
                null
            }
          </View>
        </View>
        <View style={{ marginLeft: '2%', marginTop: '-1%' }}>
          <Text style={{ color: 'gray' }}>{address}</Text>
          {
            tagline != '' ? <Text style={{ color: 'green', marginBottom: '1%' }}>{tagline}</Text> : null
          }
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  CategoryStyle: {
    paddingBottom: 3,
    alignSelf: 'baseline'
  },
  tileTextStyles: {
    alignItems: 'center',
    paddingTop: 5,
    fontSize: 23,
  },
  row: {
    backgroundColor: Config.CardViewColor,
    borderRadius: 8,
    width: '97%',
    marginRight: '3%',
    marginTop: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1
  },
  directionStyles: {
    flexDirection: 'row'
  },
});