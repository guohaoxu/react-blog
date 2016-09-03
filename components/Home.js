import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import Article from './Article'

const API_URL = ''
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: localStorage.home ? JSON.parse(localStorage.home) : []
    }
  }
  fetchData() {
    fetch(`${API_URL}/api/articles`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({articles: responseData.data})
      localStorage.home = JSON.stringify(this.state.articles)
    })
    .catch((error) => {
      browserHistory.push('/error')
    })
  }
  componentDidMount() {
    this.fetchData()
  }
  render() {
    var articles
    if (!this.state.articles.length) {
      articles = <p>暂无文章</p>
    } else {
      articles = this.state.articles.map((article, index) => (
        <Article key={index} article={article} />
      ))
    }
    return (
      <div>{articles}</div>
    )
  }
}

Home.propTypes = {
  // articles: PropTypes.array.isRequired
}
