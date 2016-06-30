/*


*/
var _ = require('lodash');
var assert = require('assert');

var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');

var SolidityFunction = require('web3/lib/web3/function');
var ethTx = require('ethereumjs-tx');

var async = require('async');
var start = new Date().getTime();

var log = console.log;


describe('ProposalOnVote Contract Suite', function() {
  this.timeout(60000);
  var sandbox = new Sandbox('http://localhost:8554');
  
  
  /*inf*/ console.log("Compiling ['ProposalOnVote.sol'] files");
  
  var compiled = helper.compile('./contract', ['ProposalOnVote.sol']);
  var proposalText = "Donald Trump For President of United States";
  
  /*inf*/
      if (compiled.errors){
        console.log(compiled.errors)
      }
      else{
        console.log("Compilation Success");  
        console.log("");
      }
  /*inf*/
  
  var proposal;
  
  
  before(function(done) {
     /*inf*/console.log(" [sandbox starting]");

    sandbox.start(__dirname + '/ethereum.json', done);

    /*inf*/ var end = new Date().getTime();
    /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
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
      /*inf*/console.log(" [test-deploy]");
      
        sandbox.web3.eth.contract(JSON.parse(compiled.contracts['ProposalOnVote'].interface)).new(
        proposalText, 
        {
              
              /* contract creator */ 
              from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",

              /* contract bytecode */ 
              data: '0x' + compiled.contracts['ProposalOnVote'].bytecode            
        }, 
          
        function(err, contract) {
                
            if (err) {
                done(err);
            }
            else if (contract.address){
                proposal = contract;
                done();
            }            
        });      
      
  });
  
  
  /*
    TestCase: check-init 
    Description: assert that the initiation value of 
                 proposal text worked as expected
  */
  it('check-init', function(done) {
    /*inf*/console.log(" [check-init]");

    /* Constant call no transaction required */    
    var recivedText = proposal.getProposalText();
    assert(recivedText, proposalText);
        
    done();
  });
  
  /*
    TestCase: check-vote-yes 
    Description: 
  */
  it('check-vote-yes', function(done) {
    /*inf*/console.log(" [check-vote-yes]");
    
    // sending transaction arbitrary signed
    // no peer keystore is involved and that
    // type of encoding can be used directly 
    // out of any browser
    var funcABI = { "constant": false, "inputs": [], "name": "voteYes", "outputs": [], "type": "function"};
    var func = new SolidityFunction(sandbox.web3, funcABI, proposal.address);
    var callData = func.toPayload([]).data;    
    
    sandbox.web3.eth.sendTransaction({
        from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392",
        to: proposal.address,
        gas: 200000,
        value: sandbox.web3.toWei(1, 'ether'),
        data: callData
    }, function(err, txHash) {
        if (err) return done(err);
            
        // we are waiting for blockchain to accept the transaction 
        helper.waitForReceipt(sandbox.web3, txHash, assertVotedYes.bind(null, done));    
    });
         
  });
  
  function assertVotedYes(done){

    /* Constant call no transaction required */
    var votedYes = proposal.getVotedYes();
    assert.equal(votedYes.toNumber(), 1); 

    done();
  }
  
  /*
    TestCase: check-vote-yes-in-loop-same-address
    Description: 
  */
  it('check-vote-yes-in-loop-same-address', function(done) {
    /*inf*/console.log(" [check-vote-yes-in-loop-same-address]");
    
    // sending transaction arbitrary signed
    // no peer keystore is involved and that
    // type of encoding can be used directly 
    // out of any browser
    var funcABI = { "constant": false, "inputs": [], "name": "voteYes", "outputs": [], "type": "function"};
    var func = new SolidityFunction(sandbox.web3, funcABI, proposal.address);
    var callData = func.toPayload([]).data;
    
    async.times(20, function(n, next){
        sandbox.web3.eth.sendTransaction({
          from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392",
          to: proposal.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether'),
          data: callData
        }, function(err, txHash) {
        if (err) return next(err);
            
        // we are waiting for blockchain to accept the transaction 
        helper.waitForReceipt(sandbox.web3, txHash, next);
        });    
    }, function(err) {
      
      if (err) return done(err);
      
      /* Constant call no transaction required */    
      var votedYes = proposal.getVotedYes();
      
      // after 20 calls the yes counter 
      // is still 1 cause it was invoked by the same sender
      assert.equal(votedYes.toNumber(), 1); 
      done();
    });
  });
    
  /*
    TestCase: check-vote-no-in-loop-same-address
    Description: 
  */
  it('check-vote-no-in-loop-5-addresses', function(done) {
    /*inf*/console.log(" [check-vote-no-in-loop-5-addresses]");
    
    // sending transaction arbitrary signed
    // no peer keystore is involved and that
    // type of encoding can be used directly 
    // out of any browser
    var funcABI = { "constant": false, "inputs": [], "name": "voteNo", "outputs": [], "type": "function"};
    var func = new SolidityFunction(sandbox.web3, funcABI, proposal.address);
    var callData = func.toPayload([]).data;
    
    var voters   = ["0xf6adcaf7bbaa4f88a554c45287e2d1ecb38ac5ff", 
                    "0xd0782de398e9eaa3eced0b853b8b2512ffa430e7", 
                    "0x9c7fa8b011a04e918dfdf6f2c37626b4de04513c", 
                    "0xa5ba148282334f30d0e7499791ccd5fcaaafe558", 
                    "0xf58366fc9d73d88b27fbbc35f1efd21232a38ce6"];
    
    async.times(5, function(n, next){
        
        sandbox.web3.eth.sendTransaction({
          from: voters[n],
          to: proposal.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether'),
          data: callData
        }, function(err, txHash) {
        if (err) return next(err);
            
          // we are waiting for blockchain to accept the transaction 
          helper.waitForReceipt(sandbox.web3, txHash, next);
        });    
        
    }, function(err) {
      
      if (err) return done(err);
      
      /* constant call: no transaction required */    
      var votedNo = proposal.getVotedNo();
      
      // after 5 calls the no counter 
      // is 5 cause it was voted by different 
      // addresses
      assert.equal(votedNo.toNumber(), 5); 
      done();
    });
  });


  /*
    TestCase: finish-the-vote
    Description: 
  */
  it('finish-the-vote', function(done) {
    /*inf*/console.log(" [finish-the-vote]");
    
    // sending transaction arbitrary signed
    // no peer keystore is involved and that
    // type of encoding can be used directly 
    // out of any browser
    var funcABI = { "constant": false, "inputs": [], "name": "finishTheVote", "outputs": [], "type": "function"};
    var func = new SolidityFunction(sandbox.web3, funcABI, proposal.address);
    var callData = func.toPayload([]).data;
    
    sandbox.web3.eth.sendTransaction({
          from: "0xdedb49385ad5b94a16f236a6890cf9e0b1e30392",
          to: proposal.address,
          gas: 200000,
          value: sandbox.web3.toWei(1, 'ether'),
          data: callData
        }, function(err, txHash) {
            if (err) done(err);
            
            // we are waiting for blockchain to accept the transaction 
            helper.waitForReceipt(sandbox.web3, txHash, function(){
            
                // asserting that there was no change
                // made: the call was not by owner
                var finished = proposal.isFinished();
                assert.equal(finished, false);
                done();
            });
        });    
  });

  
  /*
        TODO: 
         [V] add loop for 2 no votes
         2. add voting finished method
         3. try to vote after time
         4. check if the proposition was recieved
  
  */


  after(function(done) {
    
    /*inf*/console.log(" [sandbox stopping]");
    sandbox.stop(done);

    /*inf*/ var end = new Date().getTime();
    /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
});
