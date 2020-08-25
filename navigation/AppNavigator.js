import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator, AsyncStorage } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import CategoryAuthNavigator from './CategoryAuthNavigator';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import Global from '../screens/Global';

const store = configureStore()

const MainNavigation = createAppContainer(createSwitchNavigator({
  Main: MainTabNavigator,
}));

const CategoryNavigation = createAppContainer(createSwitchNavigator({
  Main: CategoryAuthNavigator,
}));

export default class TabNavigation extends Component {
  render() {
    if (Global.data.company.display_cats === 'No') {
      return (
        <Provider store={store}>
          <CategoryNavigation />
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <MainNavigation />
        </Provider>
      );
    }
  }
}