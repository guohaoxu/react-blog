import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import Article from './Article'

const API_URL = window.mainCtx || 'http://localhost:3000'
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class Tags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: []
    }
  }
  fetchData(o) {
    fetch(`${API_URL}/api/articles?tag=${o.tag}`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({articles: responseData.data})
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  componentDidMount() {
    this.fetchData({tag: this.props.params.tag})
  }
  render() {
    return (
      <div>
        <div className="my-tag-page"><span className="glyphicon glyphicon-tags my-tag-icon"></span>{this.props.params.tag}</div>
        {this.state.articles.map((article, index) => {
          return <Article article={article} key={index} />
        })}
      </div>
    )
  }
}
