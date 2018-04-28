'use strict';
const sinon = require('sinon');
const assert = require('assert');
const { Transform } = require('stream');

describe('Batch Stream', () => {
  const sandbox = sinon.createSandbox();
  let sourceStream;
  let testStream;
  let BatchStream;
  let logStub;

  before(() => {
    logStub = sandbox.stub();
    BatchStream = require('../../lib/batch-stream');
  });

  beforeEach(() => {
    sourceStream = new Transform({
      transform: (data, encoding, cb) => {
        cb(null, data);
      },
      objectMode: true
    });

    testStream = new Transform({
      transform: (data, encoding, cb) => {
        logStub(data);
        cb(null, data);
      },
      objectMode: true
    });
  });

  after(() => {
    sandbox.restore();
  });

  afterEach(() => {
    sandbox.resetHistory();
  });

  describe('Given a batch size of 2 and stream of 3 records', () => {
    beforeEach(() => {
      sourceStream.pipe(new BatchStream(2)).pipe(testStream);
    });

    it('should call the callback twice', done => {
      sourceStream.on('end', () => {
        sinon.assert.calledTwice(logStub);
        done();
      });

      sourceStream.write('1');
      sourceStream.write('2');
      sourceStream.write('3');
      sourceStream.end();
    });

    it.skip('should call the callback passing batch array data', done => {
      sourceStream.on('end', () => {
        done();
      });

      sourceStream.write('1');
      sourceStream.write('2');
      sourceStream.write('3');
      sourceStream.end();
    });
  });

  describe('Given no batch size is passed', () => {
    it('should default the batch size to 100', () => {
      let batcher = new BatchStream();
      assert(batcher.batchSize === 100);
    });
  });
});
