import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ScrollView, AsyncStorage, Modal, FlatList,
  TouchableOpacity, BackHandler, ActivityIndicator, Dimensions,
} from 'react-native';
import Config from '../../Config/Config';
import Global from '../Global';
import SecureFetch from '../SecureFetch';
import Theme from '../Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header, Button, Left, Body, Title, Right } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import ChildCategoryTile from '../Stores/ChildCategoryTile';
import HomeScreen from '../Home/HomeScreen';
import AllProduct from '../Vehicle/AllProduct';
import ProductCategories from '../Vehicle/ProductCategories';
import { connect } from 'react-redux';
import * as countActions from '../../actions/counts';
import { bindActionCreators } from 'redux';
import { withNavigation } from 'react-navigation';
import Loading from '../../components/Loading';
import Geolocation from '../More/Geolocation';
import Changelocation from '../../components/Changelocation';
import PoweredByLogo from '../../components/PoweredByLogo';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;
const ITEM_WIDTH = Dimensions.get('window').width
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

class ChildCategory extends Component {
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
      storesData: '',
      childID: '',
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('childID').then(childID => this.setState({ childID }));
    NetInfo.fetch().then(isConnected => {
      this.setState({ netInfo: isConnected });
    });
    NetInfo.addEventListener(state => { this.handleConnectivityChange(state.isConnected) });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    BackHandler.exitApp();
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ netInfo: isConnected });
    Global.NetworkInfo = isConnected;
    if (isConnected) {
      this.handleRefresh();
    } else {
      alert('Your internet is unstable, Please connect to Internet')
    }
  }

  async handleRefresh() {
    const response = await SecureFetch.getStoresJSON('GetAppInfo?', Config.Cid, Config.Basepath);
    var result = await response.json();
    this.setState({ data: result.stores, refreshing: false })

  }

  handleNavigation(item, index) {
    Global.ServicesState = true;
    console.log('ChildCategory ' + Global.ServicesState);
    console.log('ChildCategory ' + item.domain);
    AsyncStorage.setItem('childBasepath', item.domain);
    this.onNavigate(item.phone, item.domain, item.name, item.categories);
  }


  onNavigate(phone, domain, name, cat) {
    let { count, actions } = this.props;
    if (Global.CartCount.some(child => child.id === this.state.childID)) {
      let objIndex = Global.CartCount.findIndex((obj => obj.id === this.state.childID));
      Global.CartCount[objIndex].value = count;
    } else {
      Global.CartCount.push({ "id": this.state.childID, "value": count });
    }
    this.props.navigation.navigate('Loading', { cid: phone, bpath: domain, cName: name, category: cat });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onChangeLoc = () => {
    Global.ServicesState = true;
    Global.ChangeLocation = true;
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

          <Text />

          <TouchableOpacity onPress={() => this.onChangeLoc()}>
            <Changelocation />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: '5%' }}>
            Please select your Favourite Store to place Orders
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

const mapStateToProps = state => ({
  count: state.count.count
});

const ActionCreators = Object.assign({}, countActions);

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ChildCategory));

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
