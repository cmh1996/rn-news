'use strict';

import React, { Component } from 'react';
import { View, StatusBar, Text } from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import Wrapper from './components/Wrapper';

export default class Container extends Component{
    constructor(props){
      super(props)
    }
    render(){ 
      return(
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor="#d33d3c"
            barStyle="light-content"
          />
          <Navigator
            initialRoute={{component: Wrapper}}
            configureScene={() => Navigator.SceneConfigs.FloatFromRight}
            renderScene={(route, navigator) => {
              return <route.component navigator={navigator} {...route.args}/>
              }
            }
          />
        </View>
      )
    }
}
