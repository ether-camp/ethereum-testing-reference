var assert = require('assert');
var Workbench = require('ethereum-sandbox-workbench');

var fromAddress = '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826';
var workbench = new Workbench({
  defaults: {
    from: fromAddress
  }
});

var sandbox = workbench.sandbox;

workbench.startTesting(['GoldPrice', 'GoldPriceChecker'], function(contracts) {
  var goldPrice;
  var mockContract;
  var goldPriceChecker;

  it('tests-deploy', function() {
    return contracts.GoldPrice.new()
    .then(function(contract) {
      if (contract.address) {
        goldPrice = contract;
      } else {
        throw new Error('No address for deployed contract');
      }
    });
  });

  it('tests-deploy-proxy', function() {
    return contracts.GoldPrice.newMock({
      traceFunctionCalls: true
    })
    .then(function(contract) {
      mockContract = contract;
      return mockContract.price.mockCallReturnValue(299);
    })
    .then(function(receipt) {
      return mockContract.price.call();
    })
    .then(function(value) {
      assert(value.equals(299));
    });
  });

  it('tests-deploy-checker', function() {
    return contracts.GoldPriceChecker.new(mockContract.address)
    .then(function(contract) {
      goldPriceChecker = contract;
      return goldPriceChecker.getGoldPriceHappinessMeter.call();
    })
    .then(function(value) {
      assert.equal(value.toString(), '1');
      return mockContract.price.mockCallReturnValue(5);
    })
    .then(function(receipt) {
      return goldPriceChecker.getGoldPriceHappinessMeter.call();
    })
    .then(function(value) {
      assert.equal(value.toString(), '2');
    });
  });

  it('tests-callback', function() {
    return mockContract.notifyCallback.mockTransactionForward(goldPriceChecker.address, {
      contract: goldPriceChecker,
      functionName: 'setCallbackPrice',
      args: [23]
    })
    .then(function(receipt) {
      return goldPriceChecker.callbackPrice();
    })
    .then(function(value) {
      assert.equal(value.toString(), '100');
      return goldPriceChecker.executeGetPriceAsCallback();
    })
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      return goldPriceChecker.callbackPrice();
    })
    .then(function(value) {
      assert.equal(value.toString(), '23');
    });
  });

  it('tests-on-args', function() {
    return mockContract.getPriceWithParameter.mockCallReturnValue(10)
    .then(function(receipt) {
      return mockContract.getPriceWithParameter.mockCallReturnValue(20, [5]);
    })
    .then(function(receipt) {
      return mockContract.getPriceWithParameter.call(500);
    })
    .then(function(value) {
      assert(value.equals(10));
      return mockContract.getPriceWithParameter.call(5);
    })
    .then(function(value) {
      assert(value.equals(20));
    });
  });

  it('tests-tracing', function() {
    return mockContract.getPriceWithParameter(5)
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      var result = mockContract.getPriceWithParameter.wasCalled(receipt);
      assert(result.called);
      assert(result.args[0].toString(), '5');
    });
  });
});
