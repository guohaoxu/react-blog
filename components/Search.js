import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import Timeago from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import zhString from 'react-timeago/lib/language-strings/zh-CN'

const formatter = buildFormatter(zhString)

const API_URL = window.mainCtx || 'http://localhost:3000'
const API_HEADERS = {
  'Content-Type': 'application/json'
}

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: []
    }
  }
  fetchData(o) {
    fetch(`${API_URL}/api/articles?keyword=${o.keyword}`, {
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
    this.fetchData({keyword: this.props.location.query.keyword})
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData({keyword: nextProps.location.query.keyword})
  }
  render() {
    var k_reg = new RegExp(this.props.location.query.keyword, 'i'),
      searchNode
    if (!this.state.articles.length) {
      searchNode = <p>没有搜索结果</p>
    } else {
      searchNode = <ul className="list-group my-search">
        {this.state.articles.map((article, index) => {
          var title2 = article.title.replace(k_reg, `<span class="keyword">${this.props.location.query.keyword}</span>`)
          return  <li key={index} className="list-group-item clearfix">
            <div className="pull-left"><Link to={`/articles/${article._id}`} dangerouslySetInnerHTML={{__html: title2}} /> - 作者: <Link to={`/u/${article.author}`}>{article.author}</Link></div>
            <div className="pull-right"><small><Timeago date={article.time} formatter={formatter} /></small></div>
          </li>
        })}
      </ul>
    }
    return (
      <div>{searchNode}</div>
    )
  }
}
