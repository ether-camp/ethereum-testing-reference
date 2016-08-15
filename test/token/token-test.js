var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting('StandardToken', function(contracts) {

var sandbox = workbench.sandbox;
var token;
  it('init', function() {
    return contracts.StandardToken.new()
    .then(function(contract) {
      if (contract.address){
        token = contract;
      } else {
        throw new Error('No contract address');
      }        
      return true;
    });
  });
  

  it('create-1', function() {
    return token.createToken({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      value: sandbox.web3.toWei(15, 'ether')
    })
    .then(function (txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function () {
      var balance = token.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826')
      assert.equal(balance, sandbox.web3.toWei(300, 'ether'));
      return true;
    });
  });
  
});
