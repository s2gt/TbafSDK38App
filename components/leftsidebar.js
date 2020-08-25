import React, { Component } from 'react';
import {
  Content, List, Header, Body, Title, ListItem, Container, Left, Right, Text, Badge,
} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, Alert, Image, View, FlatList, Share, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Theme from '../screens/Theme';
import Global from '../screens/Global';
import SecureFetch from '../screens/SecureFetch';
import Config from '../Config/Config';
import HomeScreen from '../screens/Home/HomeScreen';
import AllProduct from '../screens/Vehicle/AllProduct';
import ProductCategories from '../screens/Vehicle/ProductCategories';
import Products from '../screens/Vehicle/Products';
import Category from '../screens/Vehicle/Category';
import MoreScreen from '../screens/More/MoreScreen';
import ContactUs from '../screens/Contact/ContactUs';
import ProvideFeedback from '../screens/More/ProvideFeedback';
import Events from '../screens/More/Events';
import Checkout from '../screens/More/Checkout';
import StaticPageDescription from '../screens/More/StaticPageDescription';
import Collapsible from 'react-native-collapsible';
import Wishlist from '../screens/Wishlist/Wishlist';
import CustomerProfilesView from '../screens/More/CustomerProfilesView';
import ChildCategoriesScreen from '../screens/Stores/ChildCategoriesScreen';
import ChildCategory from '../screens/More/ChildCategory';
import { NavigationEvents } from 'react-navigation';
// import AutoHeightWebView from 'react-native-autoheight-webview';
import { WebView } from 'react-native-webview';

import { connect } from 'react-redux';
import * as countActions from '../actions/counts';
import { bindActionCreators } from 'redux';
import { withNavigation } from 'react-navigation';

class LeftSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchIconColor: '',
      userName: '',
      backgroundColor: '',
      result: [],
      mresult: [],
      displayCategories: [],
      refreshing: true,
      cartUrl: Config.Basepath + '?target=cart',
      isHidden: false,
      collapsed: true,
      collapsedCustomerProfile: true,
      collapsableCustomerProfileIcon: 'add',
      collapsableIcon: 'add',
      // loginToken: '',
      CurrencyCode: '',
      languageCode: '',
      buyerId: '',
      childBasepath: '',
      activityIndicatorvisible: false,
      logoffURL: ''
    }
    this.handleAsyncStorage();
    this.reloadMethods();
    this.getAsyncDetails();
  }

  reloadMethods() {
    this.getMobileBlocks();
    this.getDisplayCategories();
    this.getStaticPages();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => this.reloadMethods);
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  async handleAsyncStorage() {
    this.setState({ CurrencyCode: await AsyncStorage.getItem('CurrencyCode') });
    this.setState({ languageCode: await AsyncStorage.getItem('LanguageCode') });
    await SecureFetch.getItem('StoreChildData');
  }

  async getAsyncDetails() {
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
    this.setState({ userName: await AsyncStorage.getItem('bUserName') });
    this.setState({ childBasepath: await AsyncStorage.getItem('childBasepath') });
    //this.setState({ loginToken: await AsyncStorage.getItem('LoginToken') });
    Global.LoginToken = await AsyncStorage.getItem('LoginToken');
  }

  NavigatetoSubCategory(node) {
    Global.CategoryName = [];
    Global.Categories = [];
    Global.ProductCategoriesData = node;
    Global.CategoryName.push(node.name);
    Global.Categories.push(node);
    this.props.navigation.navigate('Category', { sourcePage: 'Products', data: node.categoryId });
    this.props.navigation.closeDrawer();
  }

  async getStaticPages() {
    let sresult = [];
    for (let prop in Global.data.static_pages) {
      if (Object.prototype.hasOwnProperty.call(Global.data.static_pages, prop)) {
        let spage = prop;
        sresult.push(Global.data.static_pages[spage])
        this.state.result = sresult;
      }
    }
  }

  //This method get mobile-blocks if avilable, and store categories in this.state.mresult array.
  getMobileBlocks() {
    let mresult = [];
    if (Global.data["mobile-blocks"].length != 0) {
      let categories = '';
      for (let prop in Global.data["mobile-blocks"]) {
        if (Object.prototype.hasOwnProperty.call(Global.data["mobile-blocks"], prop)) {
          let spage = prop;
          mresult.push(Global.data["mobile-blocks"][spage])
        }
        mresult.map(obj => obj.page == "Mobile Home" ? categories = obj.categories : '');
        this.state.mresult = categories.split(',');
      }
    }
  }

  //This method generate display categories based on mobile-blocks categories value. 
  getDisplayCategories() {
    let dresult = [];
    if (this.state.mresult.length > 0) {
      for (let i = 0; i < this.state.mresult.length; i++) {
        Global.data.categories.map(item => (item.categoryId == this.state.mresult[i] && item.name != 'Locations' ? dresult.push(item) : null));
      }
      this.state.displayCategories = dresult;
    } else {
      Global.data.categories.map(item => (item.parent == 1 && item.name != 'Locations' ? dresult.push(item) : null));
      this.state.displayCategories = dresult;
    }
  }

  navigateToScreen = (route) => {
    if (route == 'Products') {
      Global.Wishlist_Load = 'Yes';
      this.props.navigation.navigate('Products', {
        sourcePage: 'Wishlist'
      });
    }
    else {
      this.props.navigation.navigate(route);
    }
    this.props.navigation.closeDrawer();
  };

  HomeScreenNavigation() {
    if (Global.data.company.apptheme === 'ECOMMERCE') {
      if (Global.data.company.display_cats === 'No') {
        this.props.navigation.navigate('AllProduct');
      } else {
        this.props.navigation.navigate('ProductCategories');
      }
    } else {
      this.props.navigation.navigate('HomeScreen');
    }
    this.props.navigation.closeDrawer();
  }

  handleStaticPageNavigation(item) {
    this.props.navigation.navigate('StaticPageDescription', {
      data: item
    });
  }

  feedBackValidation() {
    this.props.navigation.navigate('ProvideFeedback');
    this.props.navigation.closeDrawer();
  }

  async onShare() {
    try {
      if (Global.PlatformInfo === 'android') {
        const result = await Share.share({
          message: 'http://play.google.com/store/apps/details?id=' + Config.AppPackageName,
        })
      } else if (Global.PlatformInfo === 'ios') {
        const result = await Share.share({
          message: 'itms://itunes.apple.com/us/app/apple-store/' + Config.AppPackageName + '?mt=8',
        })
      }
    } catch (error) {
      alert(error.message);
    }
    this.props.navigation.closeDrawer();
  };

  onReview() {
    if (Global.PlatformInfo === 'android') {
      Linking.openURL('http://play.google.com/store/apps/details?id=' + Config.AppPackageName);
    } else if (Global.PlatformInfo === 'ios') {
    }
    this.props.navigation.closeDrawer();
  }

  toggleExpandedCustomerProfile = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsedCustomerProfile: !this.state.collapsedCustomerProfile }, () => {
      if (!this.state.collapsedCustomerProfile) {
        this.setState({ collapsableCustomerProfileIcon: 'remove' });
      }
      else {
        this.setState({ collapsableCustomerProfileIcon: 'add' });
      }
    });
  };

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed }, () => {
      if (!this.state.collapsed) {
        this.setState({ collapsableIcon: 'remove' });
      }
      else {
        this.setState({ collapsableIcon: 'add' });
      }
    });
  };

  goToCheckout() {
    this.props.navigation.navigate('Checkout')
  }

  handleCustomerProfilePage(apimethod) {
    this.props.navigation.navigate('CustomerProfilesView', {
      apimethod: apimethod,
      CurrencyCode: this.state.CurrencyCode,
      languageCode: this.state.languageCode,
      buyerId: this.state.buyerId
    });
    this.props.navigation.closeDrawer();
  }

  async handleLogout(apimethod) {
    this.setState({ buyerId: await AsyncStorage.getItem('Bid') });
    this.setState({ CurrencyCode: await AsyncStorage.getItem('CurrencyCode') });
    this.setState({ childBasepath: await AsyncStorage.getItem('childBasepath') });
    Alert.alert(
      SecureFetch.getTranslationText('mbl-Logout', 'Logout'),
      SecureFetch.getTranslationText('mbl-LogoutText', 'Are you sure you want to logout?, Logging out will clear all the products added in your cart.'),
      [
        {
          text: SecureFetch.getTranslationText('mbl-Cancel', 'Cancel'),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: SecureFetch.getTranslationText('mbl-Ok', 'OK'), onPress: () => this.hideProfileMenus(apimethod) }
      ],
      { cancelable: false }
    );
  }

  async hideProfileMenus(apimethod) {
    this.setState({ activityIndicatorvisible: true });
    this.setState({
      logoffURL: await SecureFetch.getLogoutURL(apimethod
        , this.state.buyerId
        , this.state.languageCode
        , this.state.CurrencyCode
        , this.state.childBasepath)
    });
    Global.Logoff = this.state.logoffURL;
    // const response = await SecureFetch.getLogoutURL(apimethod
    //   , this.state.buyerId
    //   , this.state.languageCode
    //   , this.state.CurrencyCode
    //   , this.state.childBasepath);
    // if (response.status == 200) {

    // } else {
    //   alert('Logout unsuccessful, Please try again later.')
    // }

    Global.LoginToken = '';
    Global.CartProducts = [];
    this.state.userName = '';
    this.state.buyerId = '';
    Global.UserName = '';
    Global.UserPhone = '';
    AsyncStorage.setItem('Bid', '');
    AsyncStorage.setItem('bUserName', '');
    AsyncStorage.setItem('LoginToken', '');
    AsyncStorage.setItem('CartProducts', JSON.stringify(Global.CartProducts));
    let { count, actions } = this.props;
    count = 0;
    actions.changeCount(count);
    this.state.activityIndicatorvisible = false;
    this.props.navigation.closeDrawer();
  }

  changeStore() {
    this.props.navigation.navigate('ChildCategory')
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    this.state.searchIconColor = Theme.setColorTheme('SearchIconColor');
    this.state.backgroundColor = Theme.setHeaderAndFooterColor('header-backgroundColor');
    const htmlContent = entities.decode(Global.data.company.description);
    const { navigation } = this.props;
    var productIcons = Global.data.company.custom1.split(',');

    return (
      <Container>

        <NavigationEvents
          onDidFocus={this.reloadMethods()}
        />

        {
          this.state.activityIndicatorvisible ?
            <WebView
              style={{ height: 0, width: 0 }}
              source={{ uri: this.state.logoffURL }}
              onError={event => { alert(event.nativeEvent.data); }}
              onLoadEnd={e => { this.setState({ activityIndicatorvisible: false }) }}
              cacheMode={"LOAD_NO_CACHE"}
            /> :
            null
        }

        <ScrollView>
          <Content>
            <ListItem style={{}}>
              <Left>
                <Image source={require('../assets/images/defaultImg.png')} style={{ width: 60, height: 60, borderRadius: 20 }} />
                <View style={{ paddingLeft: 20 }}>
                  {
                    Global.UserName === '' ? <Text>{this.state.userName}</Text> : <Text>{Global.UserName}</Text>
                  }
                  {
                    Global.UserPhone === '' ? <Text>{this.state.buyerId}</Text> : <Text>{Global.UserPhone}</Text>
                  }
                </View>
              </Left>
              <Right />
            </ListItem>
            {
              Global.StoreData.length >= 1 ?
                <ListItem onPress={() => this.changeStore()}>
                  <Left>
                    <Image style={{ height: 30, width: 30 }} source={require('../assets/images/changestore.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-ChangeStore', 'Change Store')}</Text>
                  </Left>
                </ListItem> :
                null
            }
            {
              SecureFetch.checkMenuItems('index.html') === true ?
                <ListItem onPress={() => this.HomeScreenNavigation()}>
                  <Left>
                    <Image style={{ height: 25, width: 25 }} source={require('../assets/images/Home.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getMenuItems('index.html', 'mbl-HomePage')}</Text>
                  </Left>
                </ListItem> :
                null
            }

            {
              Global.data.company.display_cats === 'No' ?
                Global.data.products.length != 0 ?
                  <ListItem onPress={() => this.navigateToScreen('AllProduct')}>
                    <Left>
                      <Image style={{ height: 25, width: 25 }} source={require('../assets/images/Products.png')} />
                      <Text style={styles.textStyles}>{SecureFetch.getMenuItems('products.html', 'mbl-Products')}</Text>
                    </Left>
                  </ListItem> : null
                :
                <View>
                  <ListItem onPress={this.toggleExpanded}>
                    <Left>
                      <Image style={{ height: 25, width: 25 }} source={require('../assets/images/Products.png')} />
                      <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-Categories', 'Categories')}</Text>
                    </Left>
                    <Right>
                      <Icon name={this.state.collapsableIcon} size={20} />
                    </Right>
                  </ListItem>
                  <Collapsible collapsed={this.state.collapsed}>
                    <View>
                      {
                        this.state.displayCategories.map((item) => (
                          <ListItem
                            key={item.name}
                            onPress={() => {
                              this.setState({ currentComponent: item.categoryId, });
                              this.NavigatetoSubCategory(item);
                            }}>
                            <Left>
                              <Icon name="subdirectory-arrow-right" size={20} />
                              <Text>{item.name}</Text>
                            </Left>
                            <Icon style={{ paddingLeft: 12 }} name="keyboard-arrow-right" size={20} />
                          </ListItem>
                        ))
                      }
                    </View>
                  </Collapsible>
                </View>
            }
            {
              Global.data.products.length != 0 && productIcons.includes('wishlist') ?
                <ListItem onPress={() => this.navigateToScreen('Products')}>
                  <Left>
                    <Image style={{ height: 25, width: 25 }} source={require('../assets/images/wishlist.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-Wishlist', 'Wishlist')}</Text>
                  </Left>
                </ListItem>
                : null
            }
            {/* <ListItem onPress={() => this.navigateToScreen('MoreScreen')}>
              <Left>
                <Image style={{ height: 25, width: 25 }} source={require('../assets/images/MyProfile.png')} />
                <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-MyProfile', 'My Profile')}</Text>
              </Left>
            </ListItem> */}
            {
              Global.LoginToken == 'login' ?
                <View>
                  <ListItem onPress={this.toggleExpandedCustomerProfile}>
                    <Left>
                      <Image style={{ height: 25, width: 25 }} source={require('../assets/images/MyProfile.png')} />
                      <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-MyProfile', 'My Profile')}</Text>
                    </Left>
                    <Right>
                      <Icon name={this.state.collapsableCustomerProfileIcon} size={20} />
                    </Right>
                  </ListItem>
                  <Collapsible collapsed={this.state.collapsedCustomerProfile}>
                    <ListItem onPress={() => this.handleCustomerProfilePage('?target=account&appview=2')}>
                      <Left>
                        <Icon name="subdirectory-arrow-right" size={20} />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/details.png')} />
                        <Text style={styles.textStyles}>Details</Text>
                      </Left>
                    </ListItem>
                    {
                      Global.data.company.apptheme === 'BUSINESS' ?
                        null
                        :
                        <ListItem onPress={() => this.handleCustomerProfilePage('?target=order_list&appview=2')}>
                          <Left>
                            <Icon name="subdirectory-arrow-right" size={20} />
                            <Image style={{ height: 30, width: 30 }} source={require('../assets/images/myOrders.png')} />
                            <Text style={styles.textStyles}>Orders</Text>
                          </Left>
                        </ListItem>
                    }
                    <ListItem onPress={() => this.handleCustomerProfilePage('?target=address_book&appview=2')}>
                      <Left>
                        <Icon name="subdirectory-arrow-right" size={20} />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/myAddressBook.png')} />
                        <Text style={styles.textStyles}>Address Book</Text>
                      </Left>
                    </ListItem>
                    <ListItem onPress={() => this.handleCustomerProfilePage('?target=messages&appview=2')}>
                      <Left>
                        <Icon name="subdirectory-arrow-right" size={20} />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/myMessages.png')} />
                        <Text style={styles.textStyles}>Messages</Text>
                      </Left>
                    </ListItem>
                    <ListItem onPress={() => this.handleCustomerProfilePage('?target=wishlist&appview=2')}>
                      <Left>
                        <Icon name="subdirectory-arrow-right" size={20} />
                        <Image style={{ height: 30, width: 30 }} source={require('../assets/images/MyInterests.png')} />
                        <Text style={styles.textStyles}>Interests</Text>
                      </Left>
                    </ListItem>
                  </Collapsible>
                </View>
                : null
            }
            {
              SecureFetch.checkMenuItems('aboutus.html') === true && htmlContent != '' ?
                <ListItem onPress={() => this.navigateToScreen('HomeScreen')}>
                  <Left>
                    <Image style={{ height: 25, width: 25 }} source={require('../assets/images/AboutUs.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getMenuItems('aboutus.html', 'mbl-AboutUs')}</Text>
                  </Left>
                </ListItem> :
                null
            }
            {
              SecureFetch.checkMenuItems('contactus.html') === true ?
                <ListItem onPress={() => this.navigateToScreen('ContactUs')}>
                  <Left>
                    <Image style={{ height: 25, width: 25 }} source={require('../assets/images/ContactUs.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getMenuItems('contactus.html', 'mbl-ContactUs')}</Text>
                  </Left>
                </ListItem> :
                null
            }
            <ListItem onPress={() => this.feedBackValidation()}>
              <Left>
                <Image style={{ height: 25, width: 25 }} source={require('../assets/images/Feedback.png')} />
                <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-ProvideFeedback', 'Provide Feedback')}</Text>
              </Left>
            </ListItem>
            {
              Global.EnabledEvents.length != 0 && Global.data.news != '' && SecureFetch.checkMenuItems('news.html') === true ?
                <ListItem onPress={() => this.navigateToScreen('Events')}>
                  <Left>
                    <Image style={{ height: 25, width: 25 }} source={require('../assets/images/Event.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getMenuItems('news.html', 'mbl-Events')}</Text>
                  </Left>
                </ListItem>
                : null
            }

            <ListItem onPress={() => this.onShare()}>
              <Left>
                <Image style={{ height: 25, width: 25 }} source={require('../assets/images/ShareApp.png')} />
                <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-ShareApp', 'Share App')}</Text>
              </Left>
            </ListItem>

            <ListItem onPress={() => this.onReview()}>
              <Left>
                <Image style={{ height: 25, width: 25 }} source={require('../assets/images/RateUs.png')} />
                <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-RateUs', 'Rate Us')}</Text>
              </Left>
            </ListItem>
            {
              Global.data.company.enable_checkout == 'Yes' ?
                <ListItem onPress={() => this.goToCheckout()}>
                  <Left>
                    <Image style={{ height: 30, width: 30 }} source={require('../assets/images/ShoppingCart.png')} />
                    <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-ShoppingCart', 'Shopping Cart')}</Text>
                  </Left>
                </ListItem> : null
            }
            <FlatList
              style={styles.flatListStyles}
              data={this.state.result}
              renderItem={({ item }) => {
                return (
                  <ListItem onPress={() => this.handleStaticPageNavigation(item)}>
                    <Left>
                      <Image style={{ height: 30, width: 30 }} source={item.image ? { uri: item.image } : null} />
                      <Text style={styles.textStyles}>{item.name}</Text>
                    </Left>
                  </ListItem>
                )
              }}
            />
            {
              Global.LoginToken == 'login' || this.state.loginToken == 'login' ?
                <View>
                  <ListItem onPress={() => { this.handleLogout('?target=login&action=logoff&appview=2') }}>
                    <Left>
                      <Image style={{ height: 30, width: 30 }} source={require('../assets/images/logOut.png')} />
                      <Text style={styles.textStyles}>{SecureFetch.getTranslationText('mbl-Logout', 'Logout')}</Text>
                    </Left>
                  </ListItem>
                </View> :
                null
            }
          </Content>
        </ScrollView>
      </Container >
    );
  }
}

const mapStateToProps = state => ({
  count: state.count.count,
});

const ActionCreators = Object.assign(
  {},
  countActions,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(LeftSideBar));

const styles = StyleSheet.create({
  textStyles: {
    marginLeft: '5%'
  },
  container: { flex: 1, backgroundColor: 'rgb(255, 255, 255)', padding: 15 },
  node: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
  },
})