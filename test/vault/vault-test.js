var assert = require('assert');

var Workbench = require('ethereum-sandbox-workbench');

var fromAddress = '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826';
var workbench = new Workbench({
  defaults: {
    from: fromAddress
  }
});

workbench.startTesting(['vault'], function(contracts) {
  var vault;
  var recoveryAddress = '0xd9dcc0e386b9018780c218c35f0ced82dd64c6af';
  var testDestinationAddress = '0xc5c1f28fc93224693b8bdf4a4c84783d6460a4d1';
  var withdrawDelay = 864000; //10 days in seconds

  var startingBlockNumber;
  it('deploys', function() {
    return contracts.Vault.new(recoveryAddress, withdrawDelay)
    .then(function(contract) {
      if (contract.address) {
        vault = contract;
        return workbench.sendTransaction({
          to: vault.address,
          value: workbench.sandbox.web3.toWei('20') //send 20 ether to the contract
        });
      }
      else throw new Error('No address for deployed contract');
    })
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      assert.equal(workbench.sandbox.web3.eth.getBalance(vault.address).toString(), workbench.sandbox.web3.toWei('20'));
      return true;
    });
  });

  it('requests unvault', function() {
    var tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10); //add 10 days to current date

    return vault.unvault(workbench.sandbox.web3.toWei('2'))
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      var unvaultLog = receipt.logs[0];
      assert.equal(unvaultLog.parsed.event, 'Unvault');
      assert.equal(unvaultLog.parsed.args.amount.toString(), workbench.sandbox.web3.toWei('2'));
      var tenDaysFromNowTimestamp = parseInt(tenDaysFromNow.getTime() / 1000);
      assert.ok(unvaultLog.parsed.args.when.greaterThanOrEqualTo(tenDaysFromNowTimestamp));
      assert.equal(workbench.sandbox.web3.eth.getBalance(vault.address).toString(), workbench.sandbox.web3.toWei('20'));
      return true;
    });
  });

  it('tries to withdraw before time has passed', function() {
    var fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5); //add 5 days to current date

    return vault.withdraw()
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      assert.equal(receipt.logs.length, 0);
      assert.equal(workbench.sandbox.web3.eth.getBalance(vault.address).toString(), workbench.sandbox.web3.toWei('20'));
      return workbench.setTimestamp(fiveDaysFromNow);
    })
    .then(function() {
      return workbench.mine(1);
    })
    .then(function() {
      var blockNumber = workbench.sandbox.web3.eth.blockNumber;
      var block = workbench.sandbox.web3.eth.getBlock(blockNumber);
      assert(parseInt(fiveDaysFromNow.getTime() / 1000) <= block.timestamp); //make sure time has moved to 5 days in the future
      return vault.withdraw();
    })
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      assert.equal(receipt.logs.length, 0);
      assert.equal(workbench.sandbox.web3.eth.getBalance(vault.address).toString(), workbench.sandbox.web3.toWei('20'));
      return true;
    });
  });

  it('tries to withdraw after time has passed', function() {
    var twentyDaysFromNow = new Date();
    twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20); //add 20 days to current date
    var initialBalance = workbench.sandbox.web3.eth.getBalance(fromAddress);

    return workbench.setTimestamp(twentyDaysFromNow)
    .then(function() {
      return workbench.mine(10); //advance 10 more blocks without setting the time, just for fun
    })
    .then(function() {
      return vault.withdraw();
    })
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      var withdrawLog = receipt.logs[0];
      assert.equal(withdrawLog.parsed.event, 'Withdraw');
      assert.equal(workbench.sandbox.web3.eth.getBalance(vault.address).toString(), workbench.sandbox.web3.toWei('18'));
      var balanceDifference = workbench.sandbox.web3.eth.getBalance(fromAddress).minus(initialBalance);
      assert.ok(balanceDifference.greaterThanOrEqualTo(1.95)); //balance difference won't be exact because of fees, but it should be more than 1.95
      return true;
    });
  });
});
