/*
 * Testing for ${home}/contract/math.sol
 */
var assert = require('assert');

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});

var sandbox = workbench.sandbox;

workbench.startTesting('Math', function(contracts) {
  /*
    TestCase: test-deploy
    Description: deploying the contract,
    validating that the deployment was good.
    The deployed contract will be used for
    contract call testing in the following
    test cases.
  */
  it('test-deploy', function() {
    console.log(' [test-deploy]');

    return contracts.Math.new()
    .then(function(contract) {
      if (contract.address){
        math = contract;
      } else {
        throw new Error('new Address for contract');
      }
      return true;
    });
  });

  /*
    TestCase: test-sum
    Description: test call to sum().
  */
  it('test-sum', function() {
    console.log(' [test-sum]');

    var expected = 4;

    return math.sum(2,2)
    .then(function (txHash) {
      return workbench.waitForSandboxReceipt(txHash);
    })
    .then(function (receipt) {
      var result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber();
      assert.equal(result, expected);
      assert.notEqual(result, 5);
      return true;
    });
 });

  /*
    TestCase: test-mul
    Description: test call to mul().
  */
  it('test-mul', function() {
    console.log(' [test-mul]');

    var expected = 9;

    return math.mul(3, 3)
    .then(function (txHash) {
      return workbench.waitForSandboxReceipt(txHash);
    })
    .then(function (receipt) {
      var result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber();
      assert.equal(result, expected);
      assert.notEqual(result, 5);
      return true;
    });
  });

  /*
    TestCase: test-sub
    Description: test call to sub().
  */
  it('test-sub', function() {
    console.log(' [test-sub]');

    var expected = 13;

    return math.sub(16, 3)
    .then(function (txHash) {
      return workbench.waitForSandboxReceipt(txHash);
    })
    .then(function (receipt) {
      var result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber();
      assert.equal(result, expected);
      assert.notEqual(result, 15);
      return true;
    });
  });

  /*
    TestCase: test-div
    Description: test call to div().
  */
  it('test-div', function() {
    console.log(' [test-div]');

    var expected = 4;

    return math.div(16, 4)
    .then(function (txHash) {
      return workbench.waitForSandboxReceipt(txHash);
    })
    .then(function (receipt) {
      var result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber();
      assert.equal(result, expected);
      assert.notEqual(result, 15);
      return true;
    });
  });
});
