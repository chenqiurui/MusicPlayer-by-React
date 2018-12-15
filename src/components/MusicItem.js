import React from 'react'
import PubSub from 'pubsub-js'

// 发布消息
class MusicItem extends React.Component{
    constructor(){
        super();
    }
    playMusic(musicItem){
        PubSub.publish('PLAY_MUSIC', musicItem);
    }
    deleteMusic(musicItem, e){
        // 组织冒泡，否则对 x 的点击会导致对li的点击，进而触发li上面的点击播放时间
        e.stopPropagation();
        PubSub.publish('DELETE_MUSIC', musicItem);
    }
    render(){
        let musicItem = this.props.musicItem;
        return (
            <li onClick={this.playMusic.bind(this, musicItem)} className={`musicitem-comp row ${this.props.focus ? 'focus' : ''}`}>
                <p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
                <p 
                    className="deleteItem"
                    onClick={this.deleteMusic.bind(this, musicItem)}
                    > X </p>
            </li>
        )
    }
}   

export default MusicItem