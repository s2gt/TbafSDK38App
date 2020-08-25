import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ScrollView, AsyncStorage, Modal, FlatList,
  TouchableOpacity, BackHandler, ActivityIndicator, Dimensions, Image
} from 'react-native';
import Config from '../../Config/Config';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Button, Left, Body, Title, Right } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import ChildCategoryTile from './ChildCategoryTile';
import CurrencyScreen from '../Home/CurrencyScreen';
import AppNavigator from '../../navigation/AppNavigator';
import Geolocation from '../More/Geolocation';
import Changelocation from '../../components/Changelocation';
import PoweredByLogo from '../../components/PoweredByLogo';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;
const ITEM_WIDTH = Dimensions.get('window').width

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

export default class ChildCategoriesScreen extends Component {
  static navigationOptions = { header: null, };
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      titleColor: '',
      font: '',
      netInfo: '',
      refreshing: true,
      data: '',
      modalVisible: false,
      storesData: ''
    }
    this.fetchChildCategories = this.fetchChildCategories.bind(this);
  }

  componentDidMount() {
    setInterval(() => { this.setState({ spinnerLoading: false }) }, 2000);
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    this.handleRefresh();
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    this.handleRefresh();
  }

  async handleRefresh() {
    await SecureFetch.getItem('StoreChildData');
    this.setState({ refreshing: true }, () => this.fetchChildCategories())
  }

  fetchChildCategories() {
    this.setState({ data: Global.data.stores, refreshing: false });
  }

  handleNavigation(item, index) {
    this.setConfigJsonData(item.phone, item.domain);
  }

  async setConfigJsonData(Cid, Basepath) {
    var childID = Cid.replace("+", "");
    var childBasepath = 'https://' + Basepath + '/';
    AsyncStorage.setItem('childBasepath', childBasepath);
    AsyncStorage.setItem('childID', childID);
    this.setModalVisible(true);
    const response = await SecureFetch.getJSON('GetAppInfo?', childID, childBasepath)
    var result;
    this.state.responseStatus = response.status;
    Global.ResponseStatus = this.state.responseStatus;
    if (response.status == 200) {
      result = await response.json();
      var setCookie = require('set-cookie-parser');
      var combinedCookieHeader = response.headers.get('Set-Cookie');
      var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
      var cookies = setCookie.parse(splitCookieHeaders);
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name == 'ETag') {
          Global.IfNoneMatch = cookies[i].value;
          AsyncStorage.setItem('IfNoneMatch', Global.IfNoneMatch);
        }
      }
      this.setState({ appData: result }, () => {
        AsyncStorage.setItem('offlineAppData', JSON.stringify(this.state.appData));
        Global.data = this.state.appData;
        Global.TabIconColor = Theme.setColorTheme('TabIconColor');
        this.setModalVisible(false);
        this.onNavigate()
      })
    } else {
      SecureFetch.getItem('offlineAppData')
        .then(appData => this.setState({ appData }, () => {
          if (this.state.appData != null) {
            Global.data = this.state.appData;
            Global.TabIconColor = Theme.setColorTheme('TabIconColor');
            this.setModalVisible(false);
            this.onNavigate()
          } else {
            this.fetchIfAsyncNull();
          }
        }))
    }
  }

  async fetchIfAsyncNull() {
    AsyncStorage.setItem('IfNoneMatch', '');
    const response = await SecureFetch.getJSON('GetAppInfo?')
    var result = await response.json();
    Global.data = result;
    Global.TabIconColor = Theme.setColorTheme('TabIconColor');
    this.setModalVisible(false);
    this.onNavigate()
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onNavigate() {
    Global.ChildCategories = true;
    this.props.navigation.navigate('CurrencyScreen');
  }

  onChangeLoc = () => {
    Global.LocationAddress = '';
    this.props.navigation.navigate('Geolocation');
  }

  render() {
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    this.state.titleColor = Theme.setHeaderAndFooterColor('header-titleColor');
    this.state.font = Theme.setFont();

    return (
      <View style={styles.mainView}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{ marginTop: 22 }}>
            <View>
              <ActivityIndicator size="large" color={'#1594A1'} />
            </View>
          </View>
        </Modal>

        <View style={styles.subView}>
          <View style={styles.languageStyles}>
            <PoweredByLogo />
          </View>

          <TouchableOpacity onPress={() => this.onChangeLoc()}>
            <Changelocation />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: '5%' }}>
            Please select your Favourite Store to place Orders.
          </Text>

          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: '5%' }}>
            {this.state.data.length} Store(s) Nearby.
          </Text>

          <FlatList
            style={styles.CategoryViewStyle}
            data={this.state.data}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity onPress={() => this.handleNavigation(item, index)}>
                    <ChildCategoryTile itemWidth={(ITEM_WIDTH - 20) / 2} result={item} />
                  </TouchableOpacity>
                </View>
              )
            }}
            keyExtractor={item => item.phone}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
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
  languageStyles: {
    alignItems: 'center'
  },
  subView: {
    height: '100%',
    marginTop: '10%',
  },
  CategoryViewStyle: {
    marginTop: '5%'
  }
});