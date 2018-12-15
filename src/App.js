import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Player from './pages/Player';
import MusicList from './pages/MusicList';
import $ from 'jquery';
import 'jplayer';
import MUSIC_LIST from './config/musiclist';
import { HashRouter, BrowserRouter, Link, Route} from 'react-router-dom'

import './style/global.css';

import PubSub from 'pubsub-js'


class App extends Component {
  constructor(){
    super();
    this.state = {
      musicList: MUSIC_LIST,
      currentItem: MUSIC_LIST[0],
      playMode: 'order'
    }
    this.playMusic = this.playMusic.bind(this);
    this.deleteMusic = this.deleteMusic.bind(this);
    this.findMusicIndex = this.findMusicIndex.bind(this);
  }

  // 播放指定曲目,同时将首页中的歌曲换成当前曲目
  playMusic(musicItem){
    $("#player").jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');
    this.setState({
      currentItem: musicItem
    })
  }

  // 找到指定曲目的索引
  findMusicIndex(musicItem){
    return this.state.musicList.indexOf(musicItem);
  }

  // 删除指定曲目
  deleteMusic(musicItem){
    this.setState({
      musicList: this.state.musicList.filter( (item) => {
        return item !== musicItem;
      } )
    })
  }
  // 播放下一曲或上一曲
  playNext(mode){
    const index = this.findMusicIndex(this.state.currentItem);
    const musicListLength = this.state.musicList.length;
    let newIndex = null;
    // 根据播放模式找出下一首
    switch(mode){
      case 'prev':
        newIndex = (index - 1 + musicListLength) % musicListLength;
        break;
      case 'order':
        newIndex = (index + 1) % musicListLength;
        break;
      case 'cycle':
        newIndex = index;
        break;
      case 'random':
        newIndex = Math.round(Math.random() * musicListLength);
        break;
      default:
        newIndex = (index + 1) % musicListLength;
    }
    this.playMusic(this.state.musicList[newIndex]);
    
  }

  // 组件挂载的时候执行
  componentDidMount(){

    $("#player").jPlayer({
      supplied:'mp3',
      wmode:'window'
    });

    // 初始化的时候播放的曲目
    this.playMusic(this.state.currentItem);
    
    // 当前曲目播放完之后自动播放下一首,下一首需要根据播放模式确定
    $('#player').bind($.jPlayer.event.ended, (e) => {
      this.playNext(this.state.playMode);
    });

    // 订阅消息
    PubSub.subscribe('PLAY_MUSIC', (msg, MusicItem) => {
      this.playMusic(MusicItem);
    });

    // 订阅消息
    PubSub.subscribe('DELETE_MUSIC', (msg, MusicItem) => {
      // 删除某一首之前，应该先判断和当前播放的是否一致，如果一致，应该将当前播放的歌曲改为下一首
      if( MusicItem === this.state.currentItem ){
        const currentIndex = this.findMusicIndex(MusicItem);
        const musicListLength = this.state.musicList.length;
        this.playMusic(this.state.musicList[(currentIndex + 1) % musicListLength]);
        this.deleteMusic(MusicItem);
      } else{
        // 如果不一致，直接删除
        this.deleteMusic(MusicItem);
      }
    });

    PubSub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev');
    });

    PubSub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext(this.state.playMode);
    });

    PubSub.subscribe('PLAY_MODE', (msg) => {
      const playmodes = ['order', 'random', 'cycle'];
      const currentModeIndex = playmodes.indexOf(this.state.playMode);
      let newMode = playmodes[(currentModeIndex + 1) % 3];
      this.setState({
        playMode: newMode
      });
    });
  }

  // 卸载组件的时候要进行解绑
  componentWillUnmount(){
    PubSub.unsubscribe('PLAY_MUSIC');
    PubSub.unsubscribe('DELETE_MUSIC');
    PubSub.unsubscribe('PLAY_PREV');
    PubSub.unsubscribe('PLAY_NEXT');
    PubSub.unsubscribe('PLAY_MODE');
    $('#player').unbind($.jPlayer.event.ended);
  }

  render() {
    return (
      <HashRouter>
        <div className="App">
          <div id="player"></div>
          <Header />
          <Route exact path="/" render={ () => (
                <Player 
                  currentItem= {this.state.currentItem} 
                  playMode = {this.state.playMode}
                />
                )}>
          </Route>
          <Route path="/list" render={ () => (
                <MusicList 
                  currentItem={this.state.currentItem} 
                  musicList = {this.state.musicList}/>
                )}>
          </Route>
        </div>
      </HashRouter>
    );
  }
}

export default App;
