import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Slider from 'rc-slider'
import {PlayBtn,StopBtn,ListBtn,PreBtn,NextBtn} from '../components/music/musicBtn'
import 'rc-slider/assets/index.css'
import { currentMusicAPI,changetimeAPI,controllAPI,changeMusicAPI } from '../actions/music'

class App extends Component {

  constructor(props) {
    super(props);
     const { dispatch,music } = this.props
     const {currentTime } = this.props.time
     const duration = music.currentMusic.duration
     this.state = {
      slider: duration ? currentTime / duration *100 : 0  ,
      playList:false
    };
  }

  async componentDidMount(){
    const { dispatch,music } = this.props
    const id = this.props.params.id
    if( id && music.currentMusic.hash !== id){
        await dispatch(currentMusicAPI(id))
    }
  }

  componentWillReceiveProps(){
    const {currentTime } = this.props.time
    const duration = this.props.music.currentMusic.duration
    this.setState({
      slider: duration === 0 ? 0 : currentTime / duration *100
    })
  }

  musicControll(){
    const { dispatch,controll,music } = this.props
    // no music
    if( music.currentMusic.hash === '' ) return 
    let status = controll === 'play' ? 'pause' : 'play'
    dispatch(controllAPI(status))
    
  }


 formatSeconds(value) { 
    var theTime = parseInt(value | 0);// 秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    // alert(theTime); 
    if(theTime >= 60) { 
    theTime1 = parseInt(theTime/60); 
    theTime = parseInt(theTime%60); 
    // alert(theTime1+"-"+theTime); 
    if(theTime1 > 60) { 
    theTime2 = parseInt(theTime1/60); 
    theTime1 = parseInt(theTime1%60); 
    } 
    } 
    var result = parseInt(theTime); 
    result = (result >= 10  ) ? ""+parseInt(theTime) : "0"+parseInt(theTime); 
    if(theTime1 > 0) { 
      var m = parseInt(theTime1)
      m = m >= 10  ? ""+m : "0"+m; 
      result = ""+m+":"+result; 
    }else{
       result = '00:'+ result
    } 

    if(theTime2 > 0) { 
    result = ""+parseInt(theTime2)+":"+result; 
    } 

    return result; 
  } 

  changeSlider(value){
    const {currentTime } = this.props.time
    const duration = this.props.music.currentMusic.duration
    if( !duration  ) return
    this.setState({
      slider:value
    })
    

    this.props.dispatch(changetimeAPI({
      currentTime: value/100 * duration ,
      changeTimeFlag: true
    }))
    
  }

   playMusic(id){
    const { dispatch,music } = this.props
    if( music.currentMusic.hash !== id ){
       dispatch(currentMusicAPI(id))
       
    }
  }

  render() {
    const { dispatch,data,login,krc,time,music,controll } = this.props
    const {currentTime } = this.props.time
    const duration = this.props.music.currentMusic.duration
    let imgU = music.currentMusic.imgUrl.replace('{size}',400)

    let krc2 =  music.currentMusic.krc.filter((item)=>
      currentTime > item.time
    )
    let s = krc2.pop()
    s = s? s : {time: 0 ,
          str: '',
          index:0}

    return (
      <div className='root'  >
        
          <div  style={{zIndex:1,position:'absolute',left:0,top:0,right:0,bottom:0}}>
            <div  style={{display: 'flex',maxWidth: '640px',widtt:'100%',height:'100%', margin: '0 auto',backgroundImage:`url(${imgU})`,backgroundSize: 'cover',filter: 'blur(3rem)',backgroundPosition: '50%'}}>
            </div>
            <div style={{zIndex:3,position:'absolute',left:0,top:0,right:0,bottom:0,opacity: '0.7',backgroundColor:'#555'}}></div>
          </div>

          <div style={{height:'100%',zIndex:10,display: 'flex',flexDirection: 'column'}}>

            <div className="header" style={{backgroundColor:'transparent',color:'#fff',display:'flex',justifyContent: 'space-between',padding:'0 1rem',borderBottom:'.01rem solid #999'}}>
              <div onClick={()=>browserHistory.goBack()} style={{display:'flex',flex:1}}>返回</div>
              <div style={{display:'flex',flex:3,justifyContent: 'center'}}>{ music.currentMusic.songName }</div>
              <div style={{display:'flex',flex:1}}></div>
            </div>

            
              <div className="container" style={{overflowY: 'auto',textAlign:'center',color:'#aaa',padding:'3rem 0',fontSize:'1.2rem'}} onClick={()=>this.setState({playList : false})} >
                {
                  music.currentMusic.krc.map((item)=> 
                    <div style={ Object.assign( {transform: 'translateY('+  (15-s.index*3.3)  +'rem)',transition: 'transform .5s ease',padding:'1rem 0'}, s.time === item.time ? {color:'#fff'} : {} )} >
                      {item.str}
                    </div>
                  )
                }
              </div>
            

            <div style={{padding:'1rem'}}>
              <div style={{display:'flex'}}>
                <div style={{padding:'0 1rem',color:'#fff'}}> {this.formatSeconds(currentTime)} </div>
                <div style={{display:'flex',flex:1}}>
                  <Slider onChange={(value)=>this.changeSlider(value)}  step={0.1} value={ this.state.slider}  onBeforeChange={()=>this.musicControll('pause')} onAfterChange={()=>this.musicControll('play')} />
                </div>
                <div style={{padding:'0 .5rem',color:'#fff'}}> {this.formatSeconds(duration)} </div> 
              </div>
              
              <div style={{display:'flex',padding:'1rem',justifyContent: 'space-between',}}>
                <div onClick={()=>console.log('...')}> </div> 
                <div onClick={()=>this.props.dispatch(changeMusicAPI(music,'pre'))}><PreBtn/></div>  
                <div onClick={()=>this.musicControll()}>{ controll === 'play' ?   <StopBtn /> : <PlayBtn /> }</div>
                <div onClick={()=>this.props.dispatch(changeMusicAPI(music))}><NextBtn/></div>  
                <div onClick={()=>this.setState({playList : true})}><ListBtn/></div> 
              </div> 
            </div>


             <div className="container" style={ Object.assign( { position:'fixed',bottom:'0',left:'0',right:'0',maxHeight:'30rem',maxWidth: '640px',margin: '0 auto', } , this.state.playList ? {display:'block'} : {display:'none'})  }>
                <div style={{minHeight:'25rem',maxWidth: '640px',widtt:'100%',height:'100%',backgroundColor:'#fff', margin: '0 auto'}}>
                    <div style={{textAlign:'center',fontSize:'1.5rem',padding:'1rem',borderBottom:'.01rem solid #ddd'}}>
                      播放列表  { music.currentMusic.hash ===''? '(0)' : `(${music.musicBox.length})`}
                    </div>
                    {
                     music.musicBox.map((item)=>
                        <div style={ music.currentMusic.hash === item.hash ? {color:'#ce3d3e'} :{} } >
                          <Item {...item} play={(id)=>this.playMusic(id)}/>
                        </div> 
                      )
                    }
                </div>

            </div>
        </div>
       

      </div>
    )
  }
}

/**
* 播放列表详情组件
*/
class Item extends Component { 
  render() {
      const {name,hash,play} = this.props
      return (
        <div  onClick={()=>play( hash )} style={{ padding:'1rem' }}>
          {name}
        </div>
      )
  }
}

function map(state) {
  return {
    music: state.music.musicBox,
    controll:state.music.controll,
    time:state.music.time
  }
}

export default connect(map)(App)
