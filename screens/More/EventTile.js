import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, Share, AsyncStorage } from 'react-native';
import Config from '../../Config/Config';
import Global from '../Global';
import Theme from '../Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-cards';
import SecureFetch from '../SecureFetch';

export default class EventTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      font: '',
      txtColor: '',
      callIconColor: '',
      shareIconColor: '',
      backgroundColor: '',
      titleTxtColor: '',
      pdtPriceTxtColor: '',
      iconName: 'star-o',
    }
  }

  callMobileNumber = () => {
    if (Global.data.company.secondary_phone == '') {
      Global.data.company.secondary_phone = Global.data.company.phone;
    }
    Linking.openURL(`tel:` + Global.data.company.secondary_phone);
  }

  onClickShare(shareContent1, shareContent2) {
    Share.share({
      message: shareContent1 + ' \n ' + shareContent2
    })
  }

  onAddtoStarred = (event) => {
    if (Global.NetworkInfo == true) {
      if (event.starred == 'false') {
        objIndex = Global.EnabledEvents.findIndex((obj => obj.id == event.id));
        Global.EnabledEvents[objIndex].starred = "true";
        this.setState({ iconName: 'star' }, () => {
          AsyncStorage.setItem('favouriteEvents', JSON.stringify(Global.EnabledEvents));
        });
        alert(SecureFetch.getTranslationText('mbl-EventsStarAlert', 'Event starred successfully'));
      } else {
        objIndex = Global.EnabledEvents.findIndex((obj => obj.id == event.id));
        Global.EnabledEvents[objIndex].starred = "false";
        this.setState({ iconName: 'star-o' }, () => {
          AsyncStorage.setItem('favouriteEvents', JSON.stringify(Global.EnabledEvents));
        });
        alert(SecureFetch.getTranslationText('mbl-EventsUnstarAlert', 'Successfully removed starred event'));
      }
    }
  }

  render() {
    const {
      name,
      date,
      brief,
      id,
      clean_url,
      starred
    } = this.props.result;

    if (starred == 'true') {
      this.state.iconName = 'star';
    } else {
      this.state.iconName = 'star-o';
    }

    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    this.state.shareIconColor = Theme.setColorTheme('ShareIconColor');
    this.state.backgroundColor = Theme.setColorTheme('HeaderBackgroundColor');
    this.state.pdtPriceTxtColor = Theme.setColorTheme('PdtPriceTxtColor');

    return (
      <View style={styles.container}>
        <Card style={styles.row}>
          <View style={{ flexDirection: 'row', marginTop: '1%', marginBottom: '2%' }}>
            <View style={{ width: '90%', marginLeft: '2%' }}>
              <Text style={[styles.text, { fontSize: Global.TxtFontSize, color: this.state.titleTxtColor, fontFamily: this.state.font, fontWeight: 'bold' }]}>{date} </Text>
              <Text style={[styles.text, { fontSize: Global.TxtFontSize, color: this.state.pdtPriceTxtColor, fontFamily: this.state.font, fontWeight: 'bold' }]}>
                {name}
              </Text>
              <Text style={[styles.text, { fontSize: Global.TxtFontSize, color: this.state.txtColor, fontFamily: this.state.font }]}>
                {brief}
              </Text>
            </View>
            <View style={styles.forwardIconStyles}>
              <Icon name='angle-right' size={26} style={{ marginRight: 10 }} color='#795548' />
            </View>
          </View>

          <View style={styles.iconContainerStyles}>

            <View style={[styles.iconViewStyles, {
              borderBottomColor: this.state.titleTxtColor, borderLeftColor: this.state.titleTxtColor
            }]}>
              <TouchableOpacity onPress={() => this.callMobileNumber()}>
                <Icon name='phone' size={23}
                  style={styles.iconstyles} color={this.state.callIconColor} />
              </TouchableOpacity>
            </View>
            <View style={[styles.iconViewStyles, {
              borderBottomColor: this.state.titleTxtColor, borderLeftColor: this.state.titleTxtColor
            }]}>
              <TouchableOpacity onPress={() => this.onClickShare(brief, clean_url)}>
                <Icon name='share-alt' size={23}
                  style={styles.iconstyles} color={this.state.shareIconColor} />
              </TouchableOpacity>
            </View>
            <View style={[styles.iconViewStyles, {
              borderBottomColor: this.state.titleTxtColor, borderLeftColor: this.state.titleTxtColor
            }]}>
              <TouchableOpacity onPress={() => this.onAddtoStarred(this.props.result)}>
                <Icon name={this.state.iconName} size={23}
                  style={styles.iconstyles} color={this.state.shareIconColor} />
              </TouchableOpacity>
            </View>

          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  row: {
    backgroundColor: Config.CardViewColor,
    borderRadius: 5,
    width: '96%',
    marginLeft: '2%',
    marginRight: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  forwardIconStyles: {
    width: '7%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    flexWrap: 'wrap',
  },
  iconstyles: {
    marginLeft: '53%',
    marginRight: '20%',
    marginBottom: '7%',
    marginTop: '7%',
  },
  iconViewStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '50%',
    borderBottomWidth: 2,
    borderTopWidth: 0.5,
    borderTopColor: '#cfd8dc',
    borderLeftWidth: 1
  },
  iconContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '15%'
  },
})
