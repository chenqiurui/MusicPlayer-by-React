import React from 'react'
import MusicItem from '../components/MusicItem';
class MusicList extends React.Component {
    render(){
        const currentItem = this.props.currentItem;
        const musicList = this.props.musicList;
        let listEle = null;
        listEle = musicList.map( (item) => {
            return (<MusicItem 
                        key = {item.id}
                        musicItem = {item}
                        focus = {item === currentItem}>
                    </MusicItem>)
        } )

        return (
            <ul>
                {listEle}
            </ul>
        )
    }
}
    

export default MusicList