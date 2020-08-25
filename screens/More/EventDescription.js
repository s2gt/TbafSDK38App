import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, BackHandler, ScrollView, Dimensions, Linking, Share, AsyncStorage
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Config from '../../Config/Config';
import Global from '../Global';
import Events from '../More/Events';
import Icon from 'react-native-vector-icons/FontAwesome';
import Theme from '../Theme';
import SecureFetch from '../SecureFetch';
import HTMLView from 'react-native-htmlview';
import AutoHeightWebView from 'react-native-autoheight-webview';

export default class EventDescription extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      backIconColor: '',
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      font: '',
      txtColor: '',
      backIconColor: '',
      pdtPriceTxtColor: '',
      titleTxtColor: '',
      callIconColor: '',
      sourcePage: '',
      iconName: 'star-o'
    };
  }

  handleBackNavigation() {
    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    this.props.navigation.state.params.onNavigateBack();
    if (this.state.sourcePage == 'HomeScreen') {
      this.props.navigation.navigate('HomeScreen');
    } else if (this.state.sourcePage == 'StarEvents') {
      this.props.navigation.navigate('StarEvents');
    } else {
      this.props.navigation.navigate('Events');
    }
  }

  componentDidMount() {
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleConnectivityChange = (isConnected) => {
    Global.NetworkInfo = isConnected;
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
    const data = this.props.navigation.getParam('data');
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.pdtPriceTxtColor = Theme.setColorTheme('PdtPriceTxtColor');
    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.callIconColor = Theme.setColorTheme('CallIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    if (data.starred == 'true') {
      this.state.iconName = 'star';
    } else {
      this.state.iconName = 'star-o';
    }

    return (
      <View style={styles.MainView}>
        <View style={[styles.SubView, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[styles.headerTitleStyles, { color: this.state.titleColor }]}>
            {entities.decode(Global.data.company.name)}
          </Text>
        </View>
        <View style={styles.subView}>
          <ScrollView>
            <Text style={{ fontSize: Global.TxtFontSize, color: this.state.titleTxtColor, fontFamily: this.state.font, fontWeight: 'bold' }}>{data.date} </Text>
            <Text style={{ fontSize: Global.TxtFontSize, color: this.state.pdtPriceTxtColor, fontFamily: this.state.font, fontWeight: 'bold', marginBottom: '5%' }} >
              {data.name}
            </Text>
            
            <AutoHeightWebView
              ref={ref => { this.webview = ref; }}
              style={{ width: Dimensions.get('window').width - 10, marginLeft: '1%' }}
              source={{ html: data.content, baseUrl: Config.Basepath }}
              onShouldStartLoadWithRequest={request => {
                let url = request.url;
                if (request.url !== data.content) {
                  Linking.openURL(request.url);
                } else {

                  return true;
                }
              }}
              zoomable={true}
              scalesPageToFit={true}
            />
          </ScrollView>
        </View>
        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-EventDescription', 'Event Description')}</Text>
          </TouchableOpacity>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.callMobileNumber()}>
              <Icon name='phone' size={25} color={this.state.callIconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.onAddtoStarred(data)}>
              <Icon name={this.state.iconName} size={25} color={this.state.callIconColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconHeartstyles}>
            <TouchableOpacity onPress={() => this.onClickShare(data.brief, data.clean_url)}>
              <Icon name='share-alt' size={25} color={this.state.callIconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    flexDirection: 'column',
  },
  subView: {
    flex: 1,
    marginBottom: '8%',
    marginLeft: '2%'
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginTop: '3%',
    width: '48%',
    flexDirection: 'row'
  },
  TitleStyles: {
    justifyContent: 'center',
    width: '80%'
  },
  viewStyles: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('7%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  row: {
    marginTop: '5%',
    marginBottom: '20%',
    marginRight: '40%',
    marginLeft: '7%',
  },
  SubView: {
    alignSelf: 'baseline',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '12%',
    marginBottom: '5%',
    flexWrap: 'wrap'
  },
  iconHeartstyles: {
    justifyContent: 'center',
    width: '15%'
  },
});