process.env.NODE_ENV = 'test';

const { assert, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/DELETE Trips', () => {
        it('Should delete all the trips', (done) => {
                chai.request(app)
                .delete('/trips')
                .end((err, res) => {
                        res.should.have.status(200);
                        done();
                });
        });
});

describe('/GET Trips', () => {
        it('Should get all the trips: EXPECTED VALUE IS EMPTY ARRAY AND ZERO LENGTH.', (done) => {
                chai.request(app)
                .get('/trips')
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                done();
                });
        });
});

describe('/POST Trips', () => {
        it('Should add all the trips from text file', (done) => {
                chai.request(app)
                .post('/trips/upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', './test/upload_test.txt')
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.be.equal('Successfully uploaded and processed the file.');
                        done();
                });
        });
});

describe('/GET Trips with return', () => {
        it('Should return all the trips: EXPECTED VALUE IS NOT EMPTY ARRAY AND NOT ZERO LENGTH.', (done) => {
                chai.request(app)
                .get('/trips')
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                });
        });
});

describe('/POST Trips with error', () => {
        it('Should return an error since file is empty.', (done) => {
                chai.request(app)
                .post('/trips/upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('file', './test/upload_test_empty.txt')
                .end((err, res) => {
                        res.should.have.status(500);
                        res.body.message.should.be.equal('Empty text file.');
                        done();
                });
        });
});
