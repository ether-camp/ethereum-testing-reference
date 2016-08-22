var assert = require('assert');
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench();

workbench.startTesting('Math', function(contracts) {
  var math;
  it('tests deploy', function() {
    return contracts.Math.new()
    .then(function(contract) {
      math = contract;
      return true;
    });
  });

  it('tests miner control', function() {
    var blockNumber = workbench.sandbox.web3.eth.blockNumber;
    return workbench.stopMiner()
    .then(function() {
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          try {
            assert.equal(workbench.sandbox.web3.eth.blockNumber, blockNumber);
            return resolve(true);
          } catch(e) {
            return reject(e);
          }
        }, 10000);
      });
    })
    .then(function() {
      return workbench.mine(10);
    })
    .then(function() {
      assert.equal(workbench.sandbox.web3.eth.blockNumber, blockNumber+10);
      return workbench.setTimestamp('20-nov-2016');
    })
    .then(function() {
      return workbench.mine(1);
    })
    .then(function() {
      var block = workbench.sandbox.web3.eth.getBlock(workbench.sandbox.web3.eth.blockNumber);
      assert.ok(block.timestamp >= Date.parse('20-nov-2016')/1000 && block.timestamp < Date.parse('21-nov-2016')/1000);
      return workbench.setTimestamp(Date.parse('20-dec-2016'));
    })
    .then(function() {
      return workbench.mine(1);
    })
    .then(function() {
      var block = workbench.sandbox.web3.eth.getBlock(workbench.sandbox.web3.eth.blockNumber);
      assert.ok(block.timestamp >= Date.parse('20-dec-2016')/1000 && block.timestamp < Date.parse('21-dec-2016')/1000);
      return workbench.setTimestamp(new Date('20-jan-2017'));
    })
    .then(function() {
      return workbench.mine(1);
    })
    .then(function() {
      var block = workbench.sandbox.web3.eth.getBlock(workbench.sandbox.web3.eth.blockNumber);
      assert.ok(block.timestamp >= Date.parse('20-jan-2017')/1000 && block.timestamp < Date.parse('21-jan-2017')/1000);
      blockNumber = workbench.sandbox.web3.eth.blockNumber;
      return workbench.startMiner();
    })
    .then(function() {
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          try {
            assert(workbench.sandbox.web3.eth.blockNumber > blockNumber);
            return resolve(true);
          } catch(e) {
            return reject(e);
          }
        }, 6000);
      });
    });
  });
});
