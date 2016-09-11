import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import Article from './Article'
import constants from './constants'

const API_URL = constants.API_URL
const API_HEADERS = constants.API_HEADERS

export default class Tags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: []
    }
  }
  fetchData() {
    fetch(`${API_URL}/tags`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({tags: responseData.data})
      // localStorage.tags = JSON.stringify(this.state.tags)
    })
    .catch((error) => {
      console.log(error)
      // browserHistory.push('/error')
    })
  }
  componentDidMount() {
    this.fetchData()
  }
  render() {
    var nodes
    if (!this.state.tags.length) {
      nodes = <p>暂无数据</p>
    } else {
      nodes = <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>标签</th>
            <th>文章数</th>
            <th>最近更新</th>
          </tr>
        </thead>
        <tbody>
          {this.state.tags.map((tag, index) => {
            return <tr key={index}>
              <td><Link to={`/tags/${tag.tagName}`}>{tag.tagName}</Link></td>
              <td>{tag.count}</td>
              <td><Link to={`/u/${tag.lastUser}`}>{tag.lastUser}</Link></td>
            </tr>
          })}
        </tbody>
      </table>
    }
    return (
      <div>{nodes}</div>
    )
  }
}
