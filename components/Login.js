import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

export default class Login extends Component {
  componentWillMount() {
    console.log('...')
    if (this.props.user.username) {
      browserHistory.push(`/u/${this.props.user.username}`)
    }
  }
  handleLogin(e) {
    e.preventDefault()
    var username = this.refs.username.value.trim(),
      password = this.refs.password.value.trim()
    if (!username) {
      this.refs.username.value = ''
      return this.refs.username.focus()
    }
    if (!password) {
      this.refs.password.value = ''
      return this.refs.password.focus()
    }
    this.props.login({
      username: username,
      password: password
    })
  }
  openGithub(e) {
    e.preventDefault()
    window.open('/auth/github', '_blank', 'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=600, top=100, left=100')
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-10 col-sm-offset-1">
          <form method="post" action="" method="post" onSubmit={this.handleLogin.bind(this)}>
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
              <div className="panel-footer">
                <button type="submit" className="btn btn-default">登录</button>&nbsp;&nbsp;
                <a className="btn btn-default" href="/auth/github" onClick={this.openGithub.bind(this)}>使用github登录</a>
              </div>
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
