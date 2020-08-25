import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import Config from '../../Config/Config';
import Theme from '../Theme';
import Global from '../Global';
import Highlighter from 'react-native-highlight-words';

export default class AllSearchTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: [],
      titleTxtColor: '',
      font: '',
    }
    this.state.searchText = Global.SearchText;
  }

  render() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    const {
      name,
    } = this.props.result;

    this.state.titleTxtColor = Theme.setColorTheme('TitleTxtColor');
    this.state.font = Theme.setFont();

    return (
      <Card style={styles.cardLayoutStyles}>
        <Highlighter
          highlightStyle={{ backgroundColor: 'yellow' }}
          searchWords={this.state.searchText}
          textToHighlight={entities.decode(name)}
          style={[styles.prodNameStyle,
          { color: this.state.titleTxtColor, fontFamily: this.state.font, fontSize: Global.TxtFontSize }]} />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardLayoutStyles: {
    backgroundColor: Config.CardViewColor,
    borderRadius: 5,
    width: '96%',
    marginLeft: '2%',
    marginRight: '2%',
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  prodNameStyle: {
    marginBottom: '2%',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: '2%',
    marginLeft: '2%',
  },
});