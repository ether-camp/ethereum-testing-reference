/*
 * Testing for ${home}/contract/MultiSig.sol
 */
var assert = require('assert');

var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');

var SolidityEvent = require("web3/lib/web3/event.js");

var log = console.log;


describe('MultiSig Contract Suite', function() {
  this.timeout(60000);
  var sandbox = new Sandbox('http://localhost:8554');
  
  var contractName = 'Wallet';
  var compiled = helper.compile('./contract', ['MultiSig.sol']);
  var creator = '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826';
  var dayLimit;
  var owners = [
      '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
      '0xf6adcaf7bbaa4f88a554c45287e2d1ecb38ac5ff'
  ];
  var required = 2;
  var wallet;
 
  function parseEvent(eventLog) {
    var parsed;
    var topics = eventLog.topics;
    wallet.abi
      .filter(function (abiEntry) {
        return abiEntry.type == 'event';
      })
      .find(function (abiEntry) {
        var solidityEvent = new SolidityEvent(null, abiEntry, null);
        if (solidityEvent.signature() == topics[0].replace('0x', '')) {
          parsed = solidityEvent.decode(eventLog);
        }
    });
    return parsed;
  }
  
  before(function(done) {
    sandbox.start(__dirname + '/ethereum.json', done);
  });
 
  /*
    TestCase: test-deploy 
    Description: deploying the contract, 
     validating that the deployment was good.
     The deployed contract will be used for 
     contract call testing in the following 
     test cases.
  */
  it('test-deploy', function(done) {
    dayLimit = sandbox.web3.toWei(0.7, 'ether');
    log(" [test-deploy]");
    sandbox.web3.eth.contract(JSON.parse(compiled.contracts[contractName].interface)).new(
    owners,
    required,
    dayLimit,
    {
      /* contract creator */ 
      from: creator,

      /* contract bytecode */ 
      data: '0x' + compiled.contracts[contractName].bytecode            
    }, 
    function(err, contract) {
      if (err) {
        done(err);
      }
      else if (contract.address){
        wallet = contract;
        done();
      }            
    });      
  });
  
  
  /*
    TestCase: check-init 
    Description: assert that the initialized owners of 
                 the wallet worked as expected
  */
  it('check-init', function() {
    log(" [check-init]");

    var requiredFromContract = wallet.m_required.call();
    assert(requiredFromContract.equals(required));

    /* m_numOwners is the pointer to the next owner slot */
    var numOwnersFromContract = wallet.m_numOwners.call();
    assert(numOwnersFromContract.equals(owners.length + 1));
  });
  
  /*
    TestCase: test-deposit
    Description: 
  */
  it('test-deposit', function(done) {
    log(" [test-deposit]");
    
    sandbox.web3.eth.sendTransaction({
      from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',
      to: wallet.address,
      gas: 200000,
      value: sandbox.web3.toWei(1, 'ether')
    }, function(err, txHash) {
      if (err) return done(err);
 
      // we are waiting for blockchain to accept the transaction 
      helper.waitForReceipt(sandbox.web3, txHash, function (err, receipt) {
        if (err) return done(err);
        if (!receipt.logs) return done('No logs in receipt');
        if (receipt.logs.length !== 1) return done('Should have been one log');

        var eventLog = receipt.logs[0];
        var parsed = parseEvent(eventLog);
        try {
          assert(sandbox.web3.eth.getBalance(wallet.address).equals(sandbox.web3.toWei(1, 'ether')));
          assert.equal(parsed.event, 'Deposit');
          assert.equal(parsed.args._from, '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
          assert(parsed.args.value.equals(sandbox.web3.toWei(1, 'ether')));
        } catch (err) {
          return done(err);
        }
        return done();
      });    
    });
  });
 
  /*
    TestCase: test-send-below-daily-limit
    Description: Tests if sending below daily limit executes
                 immediately.
  */
  it('test-send-below-daily-limit', function(done) {
    log(" [test-send-below-daily-limit]");
    
    var initialAddressBalance = sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
    wallet.execute.sendTransaction(
      '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392', 
      sandbox.web3.toWei(0.4, 'ether'),
      null, {
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      gas: 500000
    }, function(err, txHash) {
      if (err) return done(err);
            
      // we are waiting for blockchain to accept the transaction 
      helper.waitForReceipt(sandbox.web3, txHash, function (err, receipt) {
        if (err) return done(err);
        if (!receipt.logs) return done('No logs in receipt');
        if (receipt.logs.length !== 1) return done('Should have been one log');
        var eventLog = receipt.logs[0];
        var parsed = parseEvent(eventLog);
        try {
          assert.equal(parsed.event, 'SingleTransact');
          assert(sandbox.web3.eth.getBalance(wallet.address).equals(sandbox.web3.toWei(0.6, 'ether')));
          assert(sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').minus(sandbox.web3.toWei(0.4, 'ether')).equals(initialAddressBalance));
          assert(parsed.args.value.equals(sandbox.web3.toWei(0.4, 'ether')));
          assert.equal(parsed.args.owner, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');
          assert.equal(parsed.args.to, '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
        } catch (err) {
          return done(err);
        }
        return done();
      });
    });    
  });
    
  /*
    TestCase: test-confirmation-needed
    Description: If the value is over the daily limit,
                 event ConfirmationNeeded should be
                 emitted
  */
  var confirmationNeededBlock;
  it('test-confirmation-needed', function(done) {
    log(" [test-confirmation-needed]");
    
    var initialAddressBalance = sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
    wallet.execute.sendTransaction(
      '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392', 
      sandbox.web3.toWei(0.5, 'ether'),
      null, {
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      gas: 500000
    }, function(err, txHash) {
      if (err) return done(err);
            
      // we are waiting for blockchain to accept the transaction 
      helper.waitForReceipt(sandbox.web3, txHash, function (err, receipt) {
        if (err) return done(err);
        if (!receipt.logs) return done('No logs in receipt');
        if (receipt.logs.length !== 2) return done('Should have been two logs');
        var confirmedEventLog = parseEvent(receipt.logs[0]);
        confirmationNeededBlock = confirmedEventLog.blockNumber;
        var confirmationNeededEventLog = parseEvent(receipt.logs[1]);
        try {
          assert.equal(confirmedEventLog.event, 'Confirmation');
          assert.equal(confirmationNeededEventLog.event, 'ConfirmationNeeded');
          assert(sandbox.web3.eth.getBalance(wallet.address).equals(sandbox.web3.toWei(0.6, 'ether')));
          assert(sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').equals(initialAddressBalance));
          assert.equal(confirmedEventLog.args.owner, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');
          assert(confirmationNeededEventLog.args.value.equals(sandbox.web3.toWei(0.5, 'ether')));
          assert.equal(confirmationNeededEventLog.args.initiator, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');
          assert.equal(confirmationNeededEventLog.args.to, '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
        } catch (err) {
          return done(err);
        }
        return done();
      });
    });    
  });


  /*
    TestCase: test-multi-transact
    Description: confirm using another address
                 and notice the values chance.
  */
  it('test-multi-transact', function(done) {
    log(" [test-multi-transact]");
    
    var initialAddressBalance = sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
    wallet.execute.sendTransaction(
      '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392', 
      sandbox.web3.toWei(0.5, 'ether'),
      null, {
      from: '0xf6adcaf7bbaa4f88a554c45287e2d1ecb38ac5ff',
      gas: 500000
    }, function(err, txHash) {
      if (err) return done(err);
            
      // we are waiting for blockchain to accept the transaction 
      helper.waitForReceipt(sandbox.web3, txHash, function (err, receipt) {
        if (err) return done(err);
        if (!receipt.logs) return done('No logs in receipt');
        if (receipt.logs.length !== 2) return done('Should have been two logs');
        var confirmedEventLog = parseEvent(receipt.logs[0]);
        var multiTransactEventLog = parseEvent(receipt.logs[1]);
        try {
          assert.equal(confirmedEventLog.event, 'Confirmation');
          assert.equal(multiTransactEventLog.event, 'MultiTransact');
          assert(sandbox.web3.eth.getBalance(wallet.address).equals(sandbox.web3.toWei(0.1, 'ether')));
          assert(sandbox.web3.eth.getBalance('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').minus(sandbox.web3.toWei(0.5)).equals(initialAddressBalance));
          assert.equal(confirmedEventLog.args.owner, '0xf6adcaf7bbaa4f88a554c45287e2d1ecb38ac5ff');
          assert.equal(multiTransactEventLog.args.owner, '0xf6adcaf7bbaa4f88a554c45287e2d1ecb38ac5ff');
          assert(multiTransactEventLog.args.value.equals(sandbox.web3.toWei(0.5, 'ether')));
          assert.equal(multiTransactEventLog.args.to, '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392');
        } catch (err) {
          return done(err);
        }
        return done();
      });
    });    
   
  });

  after(function(done) {
    sandbox.stop(done);
  });
});
