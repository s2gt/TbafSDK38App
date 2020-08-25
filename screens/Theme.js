import React, { Component } from 'react';
import { Platform } from 'react-native';

import Global from './Global';
import Config from '../Config/Config';

export default class Theme extends Component {

  static setHeaderAndFooterColor(elementColor) {

    if (elementColor === 'header-backgroundColor') {

      return Global.data.company[elementColor] != '' ?
        Global.data.company[elementColor] : Config.HeaderBackgroundColor;

    } else if (elementColor === 'header-titleColor') {

      return Global.data.company[elementColor] != '' ?
        Global.data.company[elementColor] : Config.HeaderTitleColor;

    } else if (elementColor === 'footer-color') {

      return Global.data.company[elementColor] != '' ?
        Global.data.company[elementColor] : Config.FooterColor;
        
    } else {

      return Global.data.company[elementColor] != '' ?
        Global.data.company[elementColor] : Config.FooterTitleColor;
    }
  }

  static setColorTheme(elementColor) {

    return Global.data.company[elementColor] != '' ?
      Global.data.company[elementColor] : Config[elementColor];
  }

  static setFont() {
    if (Platform.OS === 'android') {

      return Global.data.company.AndroidFont != '' ?
        Global.data.company.AndroidFont : Config.AndroidFont;
    } else {

      return Global.data.company.iOSFont != '' ?
        Global.data.company.iOSFont : Config.iOSFont;
    }
  }
}
