process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

function runBeforeTests() {
    beforeEach(function(done) {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done())
  })
}

describe('/api/v1/ideas', () => {
  runBeforeTests()
  it('should GET all ideas', done => {
    chai.request(server)
      .get('/api/v1/ideas')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].id.should.be.a('number')
        response.body[0].title.should.be.a('string')
        response.body[0].body.should.be.a('string')
        done();
      });
  });

  it('should GET an idea by its id', done => {
    chai.request(server)
      .get('/api/v1/ideas/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].id.should.be.a('number')
        response.body[0].title.should.be.a('string')
        response.body[0].body.should.be.a('string')
        done();
      });
  });

  it('should error if given wrong id', done => {
    chai.request(server)
      .get('/api/v1/ideas/1000')
      .end((error, response) => {
        response.should.have.status(404);
        response.body.error.should.equal('Could not find an idea with id 1000')
        done();
      });
  });

  it('should POST an idea', done => {
    chai.request(server)
      .post('/api/v1/ideas')
      .send({ 
        title: 'sweet new idea',
        body: 'gotta love new ideas',
      })
      .end((error, response) => {
        response.should.have.status(201)
        response.body.id.should.be.a('number');
        response.body.should.be.a('object');
        done();
      });
  });

  it('should error if missing a required parameter', done => {
    chai.request(server)
      .post('/api/v1/ideas')
      .send({ 
        title: 'another great idea',
      })
      .end((error, response) => {
        response.should.have.status(422)
        response.body.error.should.equal(`Expected format: { title: <STRING>, body: <STRING> }. You're missing a "body" property.`)
        done();
      });
  })

  it('should Delete an idea', done => {
    chai.request(server)
      .delete('/api/v1/ideas/1')
      .end((error, response) => {
        response.should.have.status(202)
        response.body.id.should.equal('1')
        done();
      }); 
  })

  it('should error if there is no idea to delete', done => {
    chai.request(server)
      .delete('/api/v1/ideas/1000')
      .end((error, response) => {
        response.should.have.status(404);
        response.body.error.should.equal('Could not find an idea with id 1000')
        done();
      }); 
  })

  it('should display html', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return 404 on that sad path', done => {
    chai.request(server)
      .get('/ :(')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});