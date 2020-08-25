import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, BackHandler, Linking, Dimensions } from 'react-native';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import Checkout from '../More/Checkout';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { Header, Button, Left, Body, Title, Right } from 'native-base';
import { Badge } from 'react-native-elements';

export default class OthersSearchDescription extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      titleColor: '',
      footerColor: '',
      footerTitleColor: '',
      font: '',
      backIconColor: '',
      sourcePage: '',
      params: '',
      TitleTxtColor: '',
      searchIconColor: ''
    };

    this.state.sourcePage = this.props.navigation.getParam('sourcePage');
    const { params } = this.props.navigation.state;
    this.state.params = params;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackNavigation(); // works best when the goBack is async

      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackNavigation = () => {
    Global.SearchText = [];
    this.props.navigation.navigate(Global.SearchProduct,
      { sourcePage: Global.SearchSourceNavKey, data: Global.SearchKey, tabOption: this.state.params.tabOption });
  }

  openCartPage() {
    this.props.navigation.navigate('Checkout', { sourcePage: Global.SearchSourceNavKey });
  }

  openLanguagePage() {
    if (Global.NetworkInfo == true) {
      this.props.navigation.navigate('Language', { sourcePage: Global.SearchSourceNavKey });
    } else {
      alert(SecureFetch.getTranslationText('mbl-OfflineTxt', 'You are offline, Please connect to internet'));
    }
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.footerColor = Theme.setHeaderAndFooterColor('footer-color');
    this.state.footerTitleColor = Theme.setHeaderAndFooterColor('footer-titleColor');
    this.state.font = Theme.setFont();
    this.state.backIconColor = Theme.setColorTheme('BackIconColor');
    this.state.TitleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    return (
      <View style={styles.MainView}>
        {/* <View style={[styles.SubView, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[styles.headerTitleStyles, { color: this.state.titleColor, fontFamily: this.state.font }]}>
            {entities.decode(Global.data.company.name)}
          </Text>
        </View> */}

        <View style={styles.headerShadowStyles}>
          <Header style={{ backgroundColor: this.state.backgroundColor, height: 75, paddingTop: 20 }}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="navicon" size={22} color={this.state.searchIconColor} />
              </Button>
            </Left>
            <Body>
              <Text
                style={[styles.headerTitleStyles, { color: this.state.titleColor, fontFamily: this.state.font }]}>
                {entities.decode(Global.data.company.name)} </Text>
            </Body>
            <Right>
              {
                Global.data.company.enable_checkout == 'Yes' ? <View>
                  <Button transparent onPress={() => this.openCartPage()}>
                    <Icon name="shopping-cart" size={22} color={this.state.searchIconColor} />
                  </Button>
                  <Badge
                    value={Global.BadgeCount}
                    containerStyle={{ position: 'absolute', top: 0, right: 0 }} />
                </View> : null
              }
              <Button transparent onPress={() => this.openLanguagePage()}>
                <Icon name="language" size={22} color={this.state.searchIconColor} />
              </Button>
            </Right>
          </Header>
        </View>

        <Text style={[styles.upperTagLine, { fontSize: Global.TxtFontSize, color: this.state.TitleTxtColor, fontFamily: this.state.font }]}>
          {this.state.params.data.name}
        </Text>

        <Text style={[styles.upperTagLine, { fontSize: Global.TxtFontSize, color: this.state.TitleTxtColor, fontFamily: this.state.font }]}>
          {this.state.params.data.title}
        </Text>

        <AutoHeightWebView
          ref={ref => { this.webview = ref; }}
          style={{ width: Dimensions.get('window').width - 10, marginLeft: '3%' }}
          source={{ html: this.state.params.data.content, baseUrl: "https://nam.business/" }}
          onShouldStartLoadWithRequest={request => {
            let url = request.url;
            if (request.url !== this.state.description) {
              this.webview.goBack();
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
            <Text style={[styles.TextStyles, { fontSize: Global.TxtFontSize, color: this.state.footerTitleColor, fontFamily: this.state.font }]}>{SecureFetch.getTranslationText('mbl-Back', 'Back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
  },
  SubView: {
    alignSelf: 'baseline',
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 6,
  },
  viewStyles: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: hp('8%'),
    flexDirection: 'row',
  },
  headerTitleStyles: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: '10%',
    flexWrap: 'wrap'
  },
  headerShadowStyles: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingBottom: 1
  },
  TextStyles: {
    fontWeight: 'bold',
    marginLeft: '4%',
  },
  iconBackStyle: {
    justifyContent: 'flex-start',
    marginLeft: '8%',
    marginTop: '4%',
    width: '100%',
    flexDirection: 'row'
  },
  upperTagLine: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});