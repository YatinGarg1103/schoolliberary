
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Transaction from "./screens/Transaction";
import Searchscreen from "./screens/Searchscreen"

export default class App extends React.Component {
  render(){
  return (
    <AppContainer/>

  );
  }
}
const TabNavigator=createBottomTabNavigator({
Transaction:{screen:Transaction},
Searchs:{screen:Searchscreen}



},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      const routename=navigation.state.routeName;
      if(routename === "Transaction"){
        return(
          <Image
          source={require("./assets/book.png")}
          style={{width:40, height:40}}
        />
        )
        
      }
      else if( routename==="Searchs"){
        return(
          <Image
          source={require("./assets/searchingbook.png")}
          style={{width:40, height:40}}
        />
        )
        
      }
    }
  })
})
const AppContainer=createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
