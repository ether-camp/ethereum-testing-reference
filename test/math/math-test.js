/*
 * Testing for ${home}/contract/math.sol
 */
var _ = require('lodash');
var assert = require('assert');

var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');
var log    = console.log;


describe('Math Contract Suite', function() {

  // init sandbox
  this.timeout(60000);
  var sandbox = new Sandbox('http://localhost:8554');
  
  // compile the contract
  var compiled = helper.compile('./contract', ['Math.sol']);
  var math;
  
  
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
	    log(" [test-deploy]");
	  
		sandbox.web3.eth.contract(JSON.parse(compiled.contracts['Math'].interface)).new({
			  
			  /* contract creator */ 
			  from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",

			  /* contract bytecode */ 
			  data: '0x' + compiled.contracts['Math'].bytecode			
		}, 
		  
		function(err, contract) {
				
			if (err) {
				done(err);
			}
			else if (contract.address){
				
                // save reference to deployed contract
                math = contract;
				done();
			}			
		});	  
	  
  });
  
  
  /*
	TestCase: test-sum 
	Description: test call to sum().
  */
  it('test-sum', function(done) {
      log(" [test-sum]");
	  
	  /* Call to deployed math contract */
	  txHash = math.sum(2, 2);
	  expected = 4;
	  
	  /* Get the result */
	  helper.waitForSandboxReceipt(sandbox.web3, txHash, function(err, receipt) {
		if (err) return done(err);
		
			result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber() 

			assert.equal(result, expected);
			assert.notEqual(result, 5);
			 
			done();
	  });
			  
 });
  
  /*
	TestCase: test-mul
	Description: test call to mul().
  */
  it('test-mul', function(done) {
      log(" [test-mul]");
	  
	  /* Call to deployed math contract */
	  txHash = math.mul(3, 3);
	  expected = 9;
	  
	  /* Get the result */
	  helper.waitForSandboxReceipt(sandbox.web3, txHash, function(err, receipt) {
		if (err) return done(err);
		
			result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber() 

			assert.equal(result, expected);
			assert.notEqual(result, 5);
			 
			done();
	  });
			  
  });
  

  /*
	TestCase: test-sub
	Description: test call to sub().
  */
  it('test-sub', function(done) {
      log(" [test-sub]");
	  
	  /* Call to deployed math contract */
	  txHash = math.sub(16, 3);
	  expected = 13;
	  
	  /* Get the result */
	  helper.waitForSandboxReceipt(sandbox.web3, txHash, function(err, receipt) {
		if (err) return done(err);
		
			result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber() 

			assert.equal(result, expected);
			assert.notEqual(result, 15);
			 
			done();
	  });
			  
  });


  /*
	TestCase: test-div
	Description: test call to div().
  */
  it('test-div', function(done) {
      log(" [test-div]");
	  
	  /* Call to deployed math contract */
	  txHash = math.div(16, 4);
	  expected = 4;
	  
	  /* Get the result */
	  helper.waitForSandboxReceipt(sandbox.web3, txHash, function(err, receipt) {
		if (err) return done(err);
		
			result = sandbox.web3.toBigNumber(receipt.returnValue).toNumber() 

			assert.equal(result, expected);
			assert.notEqual(result, 12);
			 
			done();
	  });
			  
  });
  
  
  after(function(done) {
    sandbox.stop(done);
  });
});
