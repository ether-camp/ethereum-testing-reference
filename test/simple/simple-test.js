var assert = require('assert');

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

workbench.startTesting('Math', function(contracts) {
  it('sum-test', function() {
    return contracts.Math.new()
    .then(function(contract) {
      return contract.sum(2,2);
    })
    .then(function (txHash) {
      return workbench.waitForSandboxReceipt(txHash);
    })
    .then(function (receipt) {
      var result = workbench.sandbox.web3.toBigNumber(receipt.returnValue).toNumber();
      assert.equal(result, 4);
      assert.notEqual(result, 5);
      return true;
    });
  });
});
