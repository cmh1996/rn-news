'use strict';

import React,{ Component } from 'react';
import Container from './app/index';
import { View } from 'react-native';

export default class App extends Component<{}> {
  render(){
    return(
      <View style={{flex:1}}>
        <Container/>
      </View>
    )
  }
}