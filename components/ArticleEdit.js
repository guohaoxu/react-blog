import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'

const API_URL = window.mainCtx || 'http://localhost:3000'
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class ArticleEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      article: {}
    }
  }
  componentWillMount() {
    if (!this.props.user.username) {
      browserHistory.push('/login')
    }
  }
  fetchData(o) {
    fetch(`${API_URL}/api/articles?_id=${o._id}`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({article: responseData.data[0]})
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  componentDidMount() {
    this.fetchData({_id: this.props.params._id})
    this.refs.content.focus()
  }
  handleTextarea(e) {
    var newStateArticle = Object.assign({}, this.state.article, {
      content: e.target.value
    })
    this.setState({
      article: newStateArticle
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    fetch(`${API_URL}/api/post`, {
      method: 'put',
      headers: API_HEADERS,
      credentials: 'include',
      body: JSON.stringify({
        _id: this.state.article._id,
        content: this.state.article.content
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      browserHistory.push(`/articles/${this.state.article._id}`)
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  render() {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <form method="" action="/api/post" onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="aTitle">标题:</label>
            <input type="text" ref="title" className="form-control" id="aTitle" value={this.state.article.title ? this.state.article.title : ''} disabled={true} />
          </div>
          <div className="form-group">
            <label>标签:</label>
            <div className="clearfix">
              <input type="text" ref="tag1" className="form-control my-inline-input wid140" value={this.state.article.tags ? this.state.article.tags[0] : ''} disabled={true}/>
              <input type="text" ref="tag2" className="form-control my-inline-input wid140" value={this.state.article.tags ? this.state.article.tags[1] : ''} disabled={true} />
              <input type="text" ref="tag3" className="form-control my-inline-input wid140" value={this.state.article.tags ? this.state.article.tags[2] : ''} disabled={true} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="aPost">正文:</label>
            <div>
              <textarea className="form-control" ref="content" rows="6" id="aPost" value={this.state.article.content ? this.state.article.content : ''} onChange={this.handleTextarea.bind(this)} />
            </div>
          </div>
          <button type="submit" className="btn btn-default">发表</button>
        </form>
      </div>
    )
  }
}
