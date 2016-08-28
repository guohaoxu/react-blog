import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import update from 'react-addons-update'
import fetch from 'isomorphic-fetch'
import 'babel-polyfill'
import $ from 'jquery'
import marked from 'marked'
import Header from '../components/Header'

const API_URL = window.mainCtx || 'http://localhost:3000'
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class BlogApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: window.user,
      articles: [],
      tags: []
    }
  }
  showTip(text) {
    var $tip = $('#tip-route')
    $tip.show().find('span').text(text)
    setTimeout(() => {
      $tip.hide()
    }, 2000)
  }
  reg(reqBody) {
    fetch(`${API_URL}/api/reg`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
        this.showTip(responseData.text)
      } else {
        this.setState({user: responseData.user})
        console.log('---------reg')
        browserHistory.push(`/u/${responseData.user.username}`)
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  logout() {
    fetch(`${API_URL}/api/logout`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
       this.showTip(responseData.text)
      } else {
        this.setState({user: {}})
        browserHistory.push('/')
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  login(reqBody) {
    fetch(`${API_URL}/api/login`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
       this.showTip(responseData.text)
      } else {
        this.setState({user: responseData.user})
        browserHistory.push(`/u/${responseData.user.username}`)
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  post(reqBody) {
    fetch(`${API_URL}/api/post`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
       this.showTip(responseData.text)
      } else {
        browserHistory.push(`/u/${this.state.user.username}`)
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  updateUser(reqBody) {
    fetch(`${API_URL}/api/user`, {
      method: 'put',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
       this.showTip(responseData.text)
      } else {
        this.setState({user: responseData.data})
        browserHistory.push(`/u/${this.state.user.username}`)
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  render() {
    var propsChildren = this.props.children && React.cloneElement(this.props.children, {
      reg: this.reg.bind(this),
      login: this.login.bind(this),
      articles: this.state.articles,
      post: this.post.bind(this),
      user: this.state.user,
      tags: this.state.tags,
      updateUser: this.updateUser.bind(this)
    })
    return (
      <div>
        <Header nav={this.props.location.pathname} user={this.state.user} logout={this.logout.bind(this)} />
        <div className="container main-content">{propsChildren}</div>
        <footer>
          <div className="container">
            <p>友情链接： <a href="https://www.github.com/" target="_blank">github</a> | <a href="https://nodejs.org/en/" target="_blank">Node.js</a> | <a href="https://www.npmjs.com/" target="_blank">npmjs</a></p>
            <p>Copyright &copy; 2016 <a href="https://github.com/guohaoxu" target="_blank">@guohaoxu</a>.</p>
          </div>
        </footer>
        <div id="tip-route" ref="tipRoute"><span></span>&nbsp;&nbsp;<a href="javascript:;" onClick={() => {$('#tip-route').fadeOut()}}>x</a></div>
        <div id="upTop" className="btn btn-default"><span className="glyphicon glyphicon-menu-up"></span></div>
      </div>
    )
  }
}
