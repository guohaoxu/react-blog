import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

export default class Header extends Component {
  handleSearch(e) {
      e.preventDefault()
      var text = this.refs.input.value.trim()
      if (text.length) {
        browserHistory.push(`/search?keyword=${text}`)
      } else {
        this.refs.input.focus()
      }
      this.refs.input.value = ''
  }
  handleLogout(e) {
    e.preventDefault()
    this.props.logout()
  }
  render() {
    var navbarRight
    if (this.props.user.username) {
      navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">{this.props.user.username}<span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><Link to={`/u/${this.props.user.username}`}>我的主页</Link></li>
              <li><Link to="/post">发表</Link></li>
              <li><Link to="/setting">设置</Link></li>
              <li className="divider"></li>
              <li><a href="/logout" onClick={this.handleLogout.bind(this)}>退出</a></li>
            </ul>
          </li>
        </ul>
      )
    } else {
      navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li className={this.props.nav === '/login' ? 'active' : ''}><Link to="/login">登 录</Link></li>
          <li className={this.props.nav === '/reg' ? 'active' : ''}><Link to="/reg">注 册</Link></li>
        </ul>
      )
    }
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={this.props.nav === '/' ? 'active' : ''} ><Link to="/">首页</Link></li>
              <li className={this.props.nav === '/tags' ? 'active' : ''}><Link to="/tags">标签</Link></li>
            </ul>
            <form className="navbar-form navbar-left" action="/search" method="get" onSubmit={this.handleSearch.bind(this)}>
              <div className="form-group">
                <input type="text" name="keyword" ref="input" className="form-control" placeholder="输入标题" />
              </div>
              &nbsp;
              <button type="submit" className="btn btn-default">搜索</button>
            </form>
            {navbarRight}
          </div>
        </div>
      </nav>
    )
  }
}

Header.propTypes = {
  nav: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}
