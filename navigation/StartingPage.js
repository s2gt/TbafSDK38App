import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';
import LanguageScreen from '../screens/Home/LanguageScreen';
import SecureFetch from '../screens/SecureFetch';
import Config from '../Config/Config';
import TestMode from '../screens/Home/TestMode';
import CurrencyScreen from '../screens/Home/CurrencyScreen';
import ChildCategoriesScreen from '../screens/Stores/ChildCategoriesScreen';
import ChildCategory from '../screens/More/ChildCategory';
import Geolocation from '../screens/More/Geolocation';

const MainNavWithTestMode = createAppContainer(createSwitchNavigator({
  TestMode: TestMode,
  Geolocation: Geolocation,
  LanguageScreen: LanguageScreen,
  CurrencyScreen: CurrencyScreen,
  ChildCategoriesScreen: ChildCategoriesScreen,
  ChildCategory: ChildCategory,
  AppNavigator: AppNavigator
}));

const MainNavigation = createAppContainer(createSwitchNavigator({
  Geolocation: Geolocation,
  LanguageScreen: LanguageScreen,
  CurrencyScreen: CurrencyScreen,
  ChildCategoriesScreen: ChildCategoriesScreen,
  ChildCategory: ChildCategory,
  AppNavigator: AppNavigator
}));

export default class StartingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langKey: '',
    };
    SecureFetch.getItem('favouriteProducts');
  }

  render() {
    if (Config.TestMode == true) {
      return (
        <MainNavWithTestMode />
      );
    } else {
      return (
        <MainNavigation />
      );
    }
  }
}