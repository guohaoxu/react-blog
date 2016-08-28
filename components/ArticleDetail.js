import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import Article from './Article'
import Timeago from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import zhString from 'react-timeago/lib/language-strings/zh-CN'

const formatter = buildFormatter(zhString)

const API_URL = window.mainCtx || 'http://localhost:3000'
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class ArticleDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      article: {},
      comment: {}
    }
  }
  fetchData(o) {
    fetch(`${API_URL}/api/post?_id=${o._id}`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({article: responseData.data})
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  componentDidMount() {
    this.fetchData({_id: this.props.params._id})
  }
  handleRemove() {
    fetch(`${API_URL}/api/post`, {
      method: 'delete',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify({
        _id: this.state.article._id
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      browserHistory.push(`/u/${this.props.user.username}`)
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  handleCommentUsername(e) {
    this.setState({
      comment: Object.assign({}, this.state.comment, {
        username: e.target.value.trim()
      })
    })
  }
  handleCommentWebsite(e) {
    this.setState({
      comment: Object.assign({}, this.state.comment, {
        website: e.target.value.trim()
      })
    })
  }
  handleCommentContent(e) {
    this.setState({
      comment: Object.assign({}, this.state.comment, {
        content: e.target.value
      })
    })
  }
  handleComment(e) {
    e.preventDefault()
    if (!this.refs.content.value.trim()) {
      this.refs.content.value = ''
      this.refs.content.focus()
      return false
    }
    fetch(`${API_URL}/api/postComment`, {
      method: 'post',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify({
        _id: this.state.article._id,
        comment: this.state.comment
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        article: Object.assign({}, this.state.article, responseData.data),
        comment: {}
      })
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  render() {
    var articleDetail,
      adminNode,
      comments
    if (this.state.article.author === this.props.user.username) {
      adminNode = <div className="pull-right user-article">
        <Link to={`/edit/${this.state.article._id}`}>
        <span className="glyphicon glyphicon-edit"></span> 编辑</Link> |
        <a href="javascript:;" onClick={this.handleRemove.bind(this)}><span className="glyphicon glyphicon-remove"></span> 删除</a>
      </div>
    }
    if (!this.state.article.author) {
      articleDetail = <div>loading...</div>
    } else {
      articleDetail = <Article article={this.state.article}>
        {adminNode}
      </Article>
    }
    comments = <div className="comments">
      <ul className="list-group">
        {this.state.article.comments && this.state.article.comments.map((comment, index) =>
          <li key={index} className="list-group-item">
            <p><a href={comment.website}>{comment.username || '佚名'}</a> <small> <Timeago date={comment.time} formatter={formatter} /></small></p>
            <p>{comment.content}</p>
          </li>
        )}
      </ul>
      <form method="post" className="col-sm-6 p0" onSubmit={this.handleComment.bind(this)}>
        <div className="form-group">
          <label htmlFor="pName">用户名:</label>
          <input type="text" ref="username" value="" className="form-control" id="pName" value={this.state.comment.username ? this.state.comment.username : ''} onChange={this.handleCommentUsername.bind(this)} />
        </div>
        <div className="form-group">
          <label htmlFor="pWeb">网址:</label>
          <input type="text" ref="website" value="http://" className="form-control" id="pWeb" value={this.state.comment.website ? this.state.comment.website : 'http://'} onChange={this.handleCommentWebsite.bind(this)} />
        </div>
        <div className="form-group">
          <label htmlFor="pContent">评论:</label>
          <textarea ref="content" className="form-control" id="pContent" rows="5" value={this.state.comment.content ? this.state.comment.content : ''} onChange={this.handleCommentContent.bind(this)} />
        </div>
        <button type="submit" className="btn btn-default">评论</button>
      </form>
    </div>

    return (
      <div>{articleDetail}{comments}</div>
    )
  }
}
