import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import Article from './Article'
import constants from './constants'

const API_URL = constants.API_URL
const API_HEADERS = constants.API_HEADERS

export default class Tags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: []
    }
  }
  fetchData(o) {
    fetch(`${API_URL}/articles?tag=${o.tag}`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({articles: responseData.data})
    })
    .catch((error) => {
      console.log(error)
      // browserHistory.push('/error')
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
