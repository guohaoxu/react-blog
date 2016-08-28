import React, { Component } from 'react'

export default class NoMatch extends Component {
  render() {
    return (
      <div className="error-route">
        <h1>404</h1>
        <p>Not found</p>
      </div>
    )
  }
}