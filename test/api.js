var expect = require('chai').expect,
  superagent = require('superagent')

describe('api', () => {
  it('should post signup success', (done) => {
    superagent
      .post('http://localhost:3000/api/v1/signup')
      .send({ username: 'guohao', password: '123456'})
      //.set('X-API-Key', 'foobar')
      //.set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200)

        done()
      })
  })
})
