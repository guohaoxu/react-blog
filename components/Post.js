import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

export default class Post extends Component {
  componentWillMount() {
    if (!this.props.user.username) {
      browserHistory.push('/login')
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    var reqBody = {
      title: this.refs.title.value.trim(),
      tags: [this.refs.tag1.value.trim(), this.refs.tag2.value.trim(), this.refs.tag3.value.trim()],
      content: this.refs.content.value.trim()
    }
    if (!reqBody.title || !reqBody.content) return false
    this.props.post(reqBody)
  }
  render() {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <form method="post" action="/api/post" onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="aTitle">标题:</label>
            <input type="text" ref="title" className="form-control" id="aTitle" placeholder="标题" />
          </div>
          <div className="form-group">
            <label>标签:</label>
            <div className="clearfix">
              <input type="text" ref="tag1" className="form-control my-inline-input wid140" placeholder="标签" />
              <input type="text" ref="tag2" className="form-control my-inline-input wid140" placeholder="标签" />
              <input type="text" ref="tag3" className="form-control my-inline-input wid140" placeholder="标签" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="aPost">正文:</label>
            <div>
              <textarea className="form-control" ref="content" rows="6" id="aPost" placeholder="这里输入正文"></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-default">发表</button>
        </form>
      </div>
    )
  }
}
