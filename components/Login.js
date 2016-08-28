import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

export default class Login extends Component {
  componentWillMount() {
    if (this.props.user.username) {
      browserHistory.push('/')
    }
  }
  handleLogin(e) {
    e.preventDefault()
    var reqBody = {
      username: this.refs.username.value.trim(),
      password: this.refs.password.value.trim()
    }
    this.props.login(reqBody)
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <form method="post" action="/api/login" method="post" onSubmit={this.handleLogin.bind(this)}>
            <div className="panel panel-default">
              <div className="panel-heading">登录</div>
              <div className="panel-body">
                <div className="form-group">
                  <label htmlFor="logName">用户名：</label>
                  <input type="text" ref="username" className="form-control" id="logName" placeholder="用户名" />
                </div>
                <div className="form-group">
                  <label htmlFor="logPw">密码：</label>
                  <input type="password" ref="password" className="form-control" id="logPw" placeholder="密码" />
                </div>
              </div>
              <div className="panel-footer"><button type="submit" className="btn btn-default">登录</button></div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  // login: PropTypes.func.isRequired
}
