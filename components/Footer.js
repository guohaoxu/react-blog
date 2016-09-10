import React, { Component } from 'react'
import $ from 'jquery'

export default class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upShow: false
    }
  }
  componentDidMount() {
    var that = this
    $(window).scroll(function(){
      if($(window).scrollTop() > 500){
        that.setState({upShow: true})
      }else{
        that.setState({upShow: false})
      }
    })
  }
  upTop() {
    $("html, body").animate({
      scrollTop: 0
    })
  }
  render() {
    return (
      <div>
        <footer>
          <div className="container">
            <p>友情链接： <a href="https://www.github.com/" target="_blank">github</a> | <a href="https://nodejs.org/en/" target="_blank">Node.js</a> | <a href="https://www.npmjs.com/" target="_blank">npmjs</a></p>
            <p>Copyright &copy; 2016 <a href="https://github.com/guohaoxu" target="_blank">@guohaoxu</a>.</p>
          </div>
        </footer>
        <div id="tip-route" ref="tipRoute"><span></span>&nbsp;&nbsp;<a href="javascript:;" onClick={() => {$('#tip-route').fadeOut()}}>x</a></div>
        <div id="upTop" className={this.state.upShow ? 'btn btn-default' : 'btn btn-default hide'} onClick={this.upTop.bind(this)}><span className="glyphicon glyphicon-menu-up"></span></div>
      </div>
    )
  }
}
