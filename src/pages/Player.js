import React from 'react'
import ProgressBar from '../components/ProgressBar';
import $ from 'jquery';
import 'jplayer';
import './Player.css';
import {Link} from 'react-router-dom';
import PubSub from 'pubsub-js'

let duration = null;

class Player extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          progress: 0,
          volume: 0,
          isPlay: true,
          lefttime: ''
        }
        this.changePlayMode = this.changePlayMode.bind(this);
        this.formatTime = this.formatTime.bind(this);
      }
    componentDidMount(){
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
              progress: e.jPlayer.status.currentPercentAbsolute,
              volume: e.jPlayer.options.volume * 100,
            //   剩余时间： 总时间 * （1-当前时长）
              lefttime: this.formatTime(duration * ( 1 - e.jPlayer.status.currentPercentAbsolute  / 100))
            });
        });
    }
    componentWillUnmount(){
        $("#player").unbind($.jPlayer.event.timeupdate);
    }
    changeProgressHandler(progress){
        // 从子组件传过来的参数, 播放总时长 * 当前进度百分比
        $("#player").jPlayer('play', duration * progress);
        //!! 当处于暂停状态时，如果更改进度条，自动变为播放状态
        this.setState({
            isPlay: true
        });
    }

    // 格式化时间
    formatTime(lefttime){
        let time = Math.floor(lefttime);
        let min = Math.floor(time / 60);
        let sec = Math.floor( time % 60 );
        sec = sec < 10 ? `0${sec}` : sec;
        return `${min}:${sec}`;
    }

    // 音量控制
    changeVolumeHandler(volume){
        $("#player").jPlayer('volume', volume);
        // 当处于暂停时，点击音量按钮也要有改变
        // this.setState({
        //     volume: $.jPlayer.options.volume * 100
        // })
    }
    // 播放暂停
    play(){
        this.state.isPlay ? $('#player').jPlayer('pause') : $('#player').jPlayer('play');
        this.setState({
            isPlay: !this.state.isPlay
        });
    }
    playPrev(){
        PubSub.publish('PLAY_PREV');
    }
    playNext(){
        PubSub.publish('PLAY_NEXT');
    }
    playMode(){
        PubSub.publish('PLAY_MODE');
    }
    // 播放模式： 顺序播放、随机播放、单曲循环
    changePlayMode(mode){
        switch(mode){
            case 'order':
                return 'icon-orderplay';
                break;
            case 'random':
                return 'icon-randomplay';
                break;
            case 'cycle':
                return 'icon-cycleplay';
                break;
            default:
                return 'icon-orderplay'
        }

    }

    render() {
        return (
            <div className="player-page play-wrap contains">
                <h1 className="play-lists mt-3 ml-3"><Link to="/list">音乐列表页面 &gt;</Link></h1>
                <div className="row">
                    <div className="player-page-left col-7">
                        <h2 className="play-songname mb-3">{this.props.currentItem.title}</h2>
                        <h3 className="play-singername mb-3">{this.props.currentItem.artist}</h3>
                        <div className="play-sound row mb-4">
                            <div className="lefttime ml-3">-{this.state.lefttime}</div>
                            <div className="play-volume-icon">🔊</div>
                            <div className="play-volume">
                                <ProgressBar 
                                    progress = {this.state.volume}
                                    onChangeProgress = {this.changeVolumeHandler.bind(this)}
                                >
                                </ProgressBar>
                            </div>
                        </div>
                        <div className="play-progress mb-3">
                            <ProgressBar 
                                progress = {this.state.progress}
                                onChangeProgress = {this.changeProgressHandler.bind(this)}
                            >
                            </ProgressBar>
                        </div>
                        <div className="play-control">
                            <i 
                                className="icon iconfont icon-previous"
                                onClick={this.playPrev.bind(this)}>
                            </i>
                            <i 
                                className={`icon iconfont ${this.state.isPlay ? 'icon-play' : 'icon-pause'}`}
                                onClick={this.play.bind(this)}>
                            </i>
                            <i 
                                className="icon iconfont icon-next"
                                onClick={this.playNext.bind(this)}>
                            </i>
                            <i 
                                className={`icon iconfont ${this.changePlayMode(this.props.playMode)}`}
                                onClick = {this.playMode.bind(this)}>
                            </i>
                        </div>
                    </div>
                    <div className="player-page-right col-5 play-images mt-5">
                        <img 
                            className="play-cover" 
                            alt={this.props.currentItem.title} 
                            src={this.props.currentItem.cover}>
                        </img>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player