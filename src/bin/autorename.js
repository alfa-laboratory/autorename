#!/usr/bin/env node
const program = require('commander');
const process = require('..');

program
  .version('1.0.0')
  .arguments('<path>')
  .action((path) => {
    process(path);
  })
  .parse(process.argv);