import React from "react";
import { Dimensions } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import LeftSideBar from "../components/leftsidebar";
import Header from "../components/Header";
import HomeScreen from "../screens/Home/HomeScreen";
import AllProduct from "../screens/Vehicle/AllProduct";
import Products from "../screens/Vehicle/Products";
import MoreScreen from "../screens/More/MoreScreen";
import EventDescription from "../screens/More/EventDescription";
import SubCategory from '../screens/Vehicle/SubCategory';
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
import Currency from '../screens/More/Currency';
import StaticPageDescription from '../screens/More/StaticPageDescription';
import OthersSearchDescription from '../screens/Search/OthersSearchDescription';
import Checkout from '../screens/More/Checkout';
import StarEvents from '../screens/More/StarEvents';
import Category from "../screens/Vehicle/Category";

const WIDTH = Dimensions.get('window').width;
const LeftDrawer = createDrawerNavigator({
  HomeScreen: HomeScreen,
  AllProduct: AllProduct,
  Products: Products,
  MoreScreen: MoreScreen,
  EventDescription: EventDescription,
  SubCategory: SubCategory,
  Category: Category,
  Description: Description,
  ContactUs: ContactUs,
  LanguageScreen: LanguageScreen,
  ProvideFeedback: ProvideFeedback,
  Events: Events,
  Search: Search,
  SearchDescription: SearchDescription,
  Language: Language,
  TestMode: TestMode,
  CurrencyScreen: CurrencyScreen,
  Currency: Currency,
  StaticPageDescription: StaticPageDescription,
  OthersSearchDescription: OthersSearchDescription,
  Checkout: Checkout,
  StarEvents: StarEvents,
  Header: Header,
},
  {
    initialRouteName: "HomeScreen",
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

export default LeftDrawer;