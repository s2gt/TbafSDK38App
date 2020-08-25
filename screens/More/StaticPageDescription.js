import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Config from '../../Config/Config';

export default class StaticPageDescription extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      params: '',
      txtColor: '',
      font: '',
      footerTitleColor: '',
      backgroundColor: '',
      footerColor: '',
      backIconColor: '',
    }
  }

  handleBackNavigation() {
    this.props.navigation.goBack();
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.txtColor = Theme.setColorTheme('TxtColor');
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const data = this.props.navigation.getParam('data');

    return (
      <View style={styles.MainView}>

        <View style={[styles.SubView, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[styles.headerTitleStyles, { color: this.state.titleColor }]}>
            {entities.decode(Global.data.company.name)}
          </Text>
        </View>

        <AutoHeightWebView
          ref={ref => { this.webview = ref; }}
          style={{ width: Dimensions.get('window').width - 10, marginLeft: '3%', marginTop: '3%', flex: 1, marginBottom: '10%' }}
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
        <View style={[styles.viewStyles, { backgroundColor: this.state.footerColor }]}>
          <TouchableOpacity style={styles.iconBackStyle} onPress={() => this.handleBackNavigation()}>
            <Icon name='chevron-left' size={25} color={this.state.backIconColor} />
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>
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
    marginLeft: '8%',
    marginTop: '3%',
    width: '100%',
    flexDirection: 'row'
  },
  viewStyles: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('7%'),
    flexDirection: 'row',
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '4%',
  },
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '12%',
    marginBottom: '5%',
    flexWrap: 'wrap'
  },
  SubView: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 6,
  }
});