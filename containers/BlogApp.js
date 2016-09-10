import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import update from 'react-addons-update'
import fetch from 'isomorphic-fetch'
import 'babel-polyfill'
import $ from 'jquery'
import marked from 'marked'
import Header from '../components/Header'
import Footer from '../components/Footer'
import constants from '../components/constants'

const API_URL = constants.API_URL
const API_HEADERS = constants.API_HEADERS

export default class BlogApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
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
  signup(reqBody) {
    fetch(`${API_URL}/signup`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      if (!responseData.success) {
        // this.showTip(responseData.text)
        alert(responseData.text)
      } else {
        console.log(responseData)
        this.setState({user: responseData.data})
        // localStorage.user = JSON.stringify(this.state.user)
        // browserHistory.push(`/u/${responseData.data.username}`)
        browserHistory.push('/')
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  logout() {
    fetch(`${API_URL}/logout`, {
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
        // localStorage.user = JSON.stringify(this.state.user)
        browserHistory.push('/')
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  login(reqBody) {
    console.log('----------')
    fetch(`${API_URL}/login`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify(reqBody)
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('-------s---')
      if (!responseData.success) {
      //  this.showTip(responseData.text)
      alert(responseData.text)
      } else {
        this.setState({user: responseData.data})
        // localStorage.user = JSON.stringify(this.state.user)
        // browserHistory.push(`/u/${responseData.data.username}`)
        browserHistory.push('/')
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  post(reqBody) {
    fetch(`${API_URL}/post`, {
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
    fetch(`${API_URL}/user`, {
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
  componentDidMount() {
    fetch(`${API_URL}/auth`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then(response => response.json())
    .then(responseData => {
      this.setState({user: responseData.data})
      if (this.state.user.username) {
        // browserHistory.push(`/u/${this.state.user.username}`)
        browserHistory.push('/')
      }
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  render() {
    var propsChildren = this.props.children && React.cloneElement(this.props.children, {
      signup: this.signup.bind(this),
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
        <Footer />
      </div>
    )
  }
}
