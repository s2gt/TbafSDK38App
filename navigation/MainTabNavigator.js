import React from 'react';
import { Dimensions } from "react-native";
import LeftSideBar from "../components/leftsidebar";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from "react-navigation-drawer";
import { Root } from "native-base";
import HomeScreen from "../screens/Home/HomeScreen";
import Products from "../screens/Vehicle/Products";
import ProductCategories from "../screens/Vehicle/ProductCategories";
import MoreScreen from "../screens/More/MoreScreen";
import EventDescription from "../screens/More/EventDescription";
import SubCategory from '../screens/Vehicle/SubCategory';
import Category from '../screens/Vehicle/Category';
import Description from '../screens/Vehicle/Description';
import ContactUs from '../screens/Contact/ContactUs';
import LanguageScreen from '../screens/Home/LanguageScreen';
import ProvideFeedback from '../screens/More/ProvideFeedback';
import Events from '../screens/More/Events';
import Search from '../screens/Search/Search';
import SearchDescription from '../screens/Search/SearchDescription';
import Language from '../screens/More/Language';
import TestMode from '../screens/Home/TestMode';
import Global from '../screens/Global';
import CurrencyScreen from '../screens/Home/CurrencyScreen';
import ChildCategoriesScreen from '../screens/Stores/ChildCategoriesScreen';
import ChildCategory from '../screens/More/ChildCategory';
import Currency from '../screens/More/Currency';
import StaticPageDescription from '../screens/More/StaticPageDescription';
import OthersSearchDescription from '../screens/Search/OthersSearchDescription';
import Checkout from '../screens/More/Checkout';
import StarEvents from '../screens/More/StarEvents';
import CatSideMennu from '../components/CatSideMennu';
import CustomerProfilesView from '../screens/More/CustomerProfilesView';
import Geolocation from '../screens/More/Geolocation';
import AllProduct from "../screens/Vehicle/AllProduct";
import Services from '../screens/Services/Services';
import Loading from "../components/Loading";
import InitialLoading from "../components/InitialLoading";

const WIDTH = Dimensions.get('window').width;

const AppStackNavigator = createStackNavigator({
  InitialLoading: { screen: InitialLoading },
  HomeScreen: { screen: HomeScreen },
  Products: { screen: Products },
  ProductCategories: { screen: ProductCategories },
  MoreScreen: { screen: MoreScreen },
  EventDescription: { screen: EventDescription },
  SubCategory: { screen: SubCategory },
  Category: { screen: Category },
  Description: { screen: Description },
  ContactUs: { screen: ContactUs },
  LanguageScreen: { screen: LanguageScreen },
  ProvideFeedback: { screen: ProvideFeedback },
  Events: { screen: Events },
  Search: { screen: Search },
  SearchDescription: { screen: SearchDescription },
  Language: { screen: Language },
  TestMode: { screen: TestMode },
  CurrencyScreen: { screen: CurrencyScreen },
  ChildCategoriesScreen: { screen: ChildCategoriesScreen },
  ChildCategory: { screen: ChildCategory },
  Currency: { screen: Currency },
  StaticPageDescription: { screen: StaticPageDescription },
  OthersSearchDescription: { screen: OthersSearchDescription },
  Checkout: { screen: Checkout },
  StarEvents: { screen: StarEvents },
  CatSideMennu: { screen: CatSideMennu },
  CustomerProfilesView: { screen: CustomerProfilesView },
  Geolocation: { screen: Geolocation },
  AllProduct: { screen: AllProduct },
  Services: { screen: Services },
  Loading: { screen: Loading },
}, {
  headerMode: 'none',
});

const AppDrawerNavigator = createDrawerNavigator({
  HomeScreen: AppStackNavigator,
},
  {
    initialRouteName: 'HomeScreen',
    headerMode: 'none',
    drawerWidth: WIDTH * 0.80,
    drawerPosition: 'left',
    contentOptions: {
      activeTintColor: '#ffffff',
      inactiveTintColor: '#1999CE',
      activeBackgroundColor: '#1999CE',
      inactiveBackgroundColor: '#ffffff',
    },
    contentComponent: props => <LeftSideBar {...props} />,
    drawerOpenRoute: 'LeftSideMenu',
    drawerCloseRoute: 'LeftSideMenuClose',
    drawerToggleRoute: 'LeftSideMenuToggle',
  });

export default createAppContainer(AppDrawerNavigator);