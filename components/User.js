import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import Article from './Article'
import constants from './constants'

const API_URL = constants.API_URL
const API_HEADERS = constants.API_HEADERS

export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      user: {}
    }
  }
  fetchUser(o) {
    fetch(`${API_URL}/user?username=${o.username}`, {
      method: 'get',
      headers: API_HEADERS,
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({user: responseData.data})
    })
    .catch((error) => {
      console.log(error)
      // browserHistory.push('/error')
    })
  }
  fetchData(o) {
    fetch(`${API_URL}/articles?username=${o.username}`, {
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
    this.fetchUser({username: this.props.params.username})
    this.fetchData({username: this.props.params.username})
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.user.username)
    if (!nextProps.user.username) return
    this.fetchUser({username: nextProps.params.username})
    this.fetchData({username: nextProps.params.username})
  }
  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body clearfix">
            <img src={this.state.user.tx} className="img-responsive img-rounded pull-left wid120 right20" />
            <h2>{this.props.params.username}</h2>
            <p>{this.state.user.description}</p>
          </div>
        </div>
        {this.state.articles.map((article, index) => {
          return <Article key={index} article={article} />
        })}
      </div>
    )
  }
}

User.propTypes = {
  // articles: PropTypes.array.isRequired
}
