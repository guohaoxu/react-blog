import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import marked from 'marked'
import Timeago from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import zhString from 'react-timeago/lib/language-strings/zh-CN'

const formatter = buildFormatter(zhString)

export default class Article extends Component {
  render() {
    var article = this.props.article
    return (
      <div className="article-per">
        <div className="img-left wid64">
          <Link to={`/u/${article.author}`}><img src={article.tx} alt="#" title={article.author} className="img-responsive" /></Link>
        </div>
        <div className="content-right">
          <div className="panel panel-default">
            <div className="panel-heading">作者: <Link to={`/u/${article.author}`}>{article.author}</Link></div>
            <div className="panel-body">
              <div className="article-title"><Link to={`/articles/${article._id}`}>{article.title}</Link>{this.props.children}</div>
              <div className="clearfix" dangerouslySetInnerHTML={{__html:marked(article.content)}} />
              <div><small><Timeago date={article.createdAt} formatter={formatter} /></small></div>
            </div>
            <div className="panel-footer clearfix">
              <div className="pull-left">
                <span className="glyphicon glyphicon-tags"></span>
                {article.tags.map((tag, index) =>
                  <Link key={index} to={`/tags/${tag}`}>{tag}</Link>
                )}
              </div>
              <div className="text-right">阅读: {article.pv || 0} | 评论: {article.comments.length || 0}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Article.propTypes = {
  // login: PropTypes.func.isRequired
}
