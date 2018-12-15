import React from 'react'

class ProgressBar extends React.Component {
    constructor(props){
        super(props);
        this.changeProgress = this.changeProgress.bind(this);
    }
    changeProgress(e){
        let progressBar = this.refs.progressBar;
        // （点击位置距离页面左边界的距离 - 进度条组件距离页面左边界的距离）/ 进度条组件总长度
        let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.onChangeProgress && this.props.onChangeProgress(progress);
        
    }
    render(){
        return (
            <div 
                className="progressbar-comp" 
                onClick={this.changeProgress}
                ref="progressBar"
            >
                    <div 
                        className="progress" 
                        style={{width:`${this.props.progress}%`}} 
                    >
                    </div>
            </div>
        )
    }
}

export default ProgressBar