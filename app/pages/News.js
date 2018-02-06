'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackToTop from '../components/BackToTop';
import TabList from '../components/TabList';
import WebViewPage from './WebViewPage';

import Search from './Search';

import {getNewsByChannel} from '../api/news';
import {px2dp} from '../util';

export default class News extends Component {
  constructor(props){
      super(props);
      this.state = {
        isFreshing:false,
        newsData:[],
        curChannelIndex:0,
        channelId:['c9','c5','c17','c3','c7','c6','c11','c2'],
      }
  }

  componentDidMount(){
    this.fetchNewsData(this.state.channelId[this.state.curChannelIndex],1,10)
  }

  navToSearch(){
    this.props.navigator.push({
        component: Search,
        args: {}
    });
  }

  chooseNews(docid){
    this.props.navigator.push({
        component: WebViewPage,
        args: {
          uri:`http://www.yidianzixun.com/article/${docid}`
        }
    });
  }


  changeChannel(index){
    this.setState({
      newsData:[],
      curChannelIndex:index
    },()=>{
      this.fetchNewsData(this.state.channelId[index],1,10);
      this.refs.newsList.scrollToOffset({x: 0, y: 0, animated: false});
    })
  }

  fetchNewsData(channelId,start,end){
    const res = getNewsByChannel(channelId,start,end);
    res.then((newsArr)=>{
      let temArr = this.state.newsData.slice();
      temArr.push(...newsArr);
      this.setState({
        newsData:temArr
      })
    })
    .catch((e)=>{
      ToastAndroid.show(e, ToastAndroid.SHORT);
    })
  }

  loadMore(){
    if(this.state.newsData.length<=0){
      return;
    }
    this.fetchNewsData(this.state.channelId[this.state.curChannelIndex],(this.state.newsData.length+2),(this.state.newsData.length+12))
  }

  refreshHandle(){
    this.setState({
      newsData:[]
    },()=>{
      this.fetchNewsData(this.state.channelId[this.state.curChannelIndex],1,10);
    });
  }

  backToTop(){
    this.refs.newsList.scrollToOffset({x: 0, y: 0, animated: true});
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>明日头条</Text>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.searchBox}
            onPress={this.navToSearch.bind(this)}
          >
            <Icon style={styles.searchIcon} name='search'/>
            <Text style={styles.searchText}>搜你想搜的</Text>
          </TouchableOpacity>
        </View>
        <TabList 
          items={['推荐','财经','社会','娱乐','军事','科技','汽车','体育']}
          selectHandle={this.changeChannel.bind(this)}
        />
        <FlatList
          ref="newsList"
          ItemSeparatorComponent={()=>{return (<View style={styles.line}></View>)}} 
          data={this.state.newsData}
          onEndReached={this.loadMore.bind(this)}
          onEndReachedThreshold={0.2}
          renderItem={({item, separators}) => (
            <TouchableHighlight
              onPress={this.chooseNews.bind(this,item.docid)}> 
              <View style={styles.newsItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.imgBox}>
                {
                  item.image_urls?
                  item.image_urls.map((img,index)=>{
                    return(
                      <Image
                        style={
                          item.image_urls.length===1?
                          styles.oneImg
                          :
                          (item.image_urls.length-1)===index?styles.lastImg:styles.itemImg
                        }
                        source={{uri: img}}
                        resizeMode='stretch'
                        key={index}
                      />
                    )
                  }):[]
                }
                </View>
                <View style={styles.tipsBox}>
                  <Text style={styles.tips}>{item.source}</Text>
                  <Text style={styles.tips}>{(item.comment_count || 0)+'评论'}</Text>
                  <Text style={styles.tips}>{(item.like || 0)+'赞'}</Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.isFreshing}
                  onRefresh={this.refreshHandle.bind(this)}
                  colors={['red','#ffd500','#0080ff','#99e600']}
                  tintColor='red'
                  title="Loading..."
                  titleColor='red'
              />
          }
        />
        <BackToTop pressHandle={this.backToTop.bind(this)}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerBar:{
    height:px2dp(40),
    backgroundColor:'#d33d3c',
    flexDirection:'row',
    paddingLeft:px2dp(10),
    paddingRight:px2dp(10),
    alignItems:'center'
  },
  headerTitle:{
    fontWeight:'bold',
    fontSize:px2dp(18),
    color:'white'
  },
  searchBox:{
    backgroundColor:'#f5f5f3',
    flex:1,
    marginLeft:px2dp(15),
    height:px2dp(25),
    borderRadius:px2dp(3),
    padding:px2dp(3),
    flexDirection:'row',
    alignItems:'center'
  },
  searchIcon:{
    fontSize:px2dp(18),
  },
  searchText:{
    fontSize:px2dp(13),
  },
  line:{
    backgroundColor:'#f5f5f3',
    height:px2dp(1),
  },
  newsItem:{
    backgroundColor: 'white',
    padding:px2dp(10)
  },
  itemTitle:{
    fontSize:px2dp(16),
    color:'black',
  },
  imgBox:{
    flexDirection:'row',
    marginTop:px2dp(6),
  },
  itemImg:{
    flex:1,
    marginRight:px2dp(4),
    height:px2dp(70),
  },
  lastImg:{
    flex:1,
    marginRight:0,
    height:px2dp(70),
  },
  oneImg:{
    flex:1,
    height:px2dp(180),
  },
  tipsBox:{
    flexDirection:'row',
    marginTop:px2dp(6)
  },
  tips:{
    fontSize:px2dp(12),
    marginRight:px2dp(6)
  },
})