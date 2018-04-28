'use strict';

const { Transform } = require('stream');

class BatchStream extends Transform {
  constructor(batchSize = 100) {
    super({ objectMode: true });
    this.batchSize = batchSize;
    this.buffer = [];
  }

  _transform(data, encoding, cb) {
    this.buffer.push(data);
    if (this.buffer.length >= this.batchSize) {
      this.push(this.buffer);
      this.buffer.length = 0;
    }
    cb();
  }

  _flush(cb) {
    if (this.buffer.length > 0) {
      this.push(this.buffer);
      this.buffer = 0;
    }
    cb();
  }
}

module.exports = BatchStream;
