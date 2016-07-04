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
  
  
  /*inf*/ console.log("Compiling ['ContractA.sol'] files");
  
  var compiled = helper.compile('./contract',  ['ContractA.sol']);
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
  
  var contractA;
  
  
  before(function(done) {
     /*inf*/console.log(" [sandbox starting]");

    sandbox.start(__dirname + '/ethereum.json', done);

    /*inf*/ var end = new Date().getTime();
    /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
  
  
  /*
    TestCase: test-deploy 
    Description: 
  */
  it('test-deploy', function(done) {
      /*inf*/console.log(" [test-deploy]");
      
        sandbox.web3.eth.contract(JSON.parse(compiled.contracts['ContractA'].interface)).new(
        proposalText, 
        {
              
              /* contract creator */ 
              from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",

              /* contract bytecode */ 
              data: '0x' + compiled.contracts['ContractA'].bytecode            
        }, 
          
        function(err, contract) {
                
            if (err) {
                done(err);
            }
            else if (contract.address){
                contractA = contract;
                done();
            }            
        });      
      
  });
  
  
  /**
   * TestCase: check-init 
   * Description: 
   */
  it('check-init', function(done) {
    /*inf*/console.log(" [check-init]");

    var owner = contractA.getOwner();
    assert.equal(owner, "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826");    
        
    done();
  });


  /**
   * TestCase: get-address-from-namereg 
   * Description: 
   */
  it('get-address-from-namereg', function(done) {
    /*inf*/console.log(" [get-address-from-namereg]");

    var abi = [
                  {
                    "constant": true,
                    "inputs": [
                      {
                        "name": "name",
                        "type": "bytes32"
                      }
                    ],
                    "name": "addressOf",
                    "outputs": [
                      {
                        "name": "addr",
                        "type": "address"
                      }
                    ],
                    "type": "function"
                  }
                ];
                
    // Access nameReg predefined in ethereum.json env conf file
    // the address 0x0860a8008298322a142c09b528207acb5ab7effc 
    // is hardcoded for that environment    
    var nameReg = sandbox.web3.eth.contract(abi).at("0x0860a8008298322a142c09b528207acb5ab7effc");   
    var addressA = nameReg.addressOf("ContractA");    
    
    var contractA_ABI = [
                  {
                    "constant": true,
                    "inputs": [],
                    "name": "getName",
                    "outputs": [
                      {
                        "name": "result",
                        "type": "address"
                      }
                    ],
                    "type": "function"
                  }
                ];
    
    var contractA_tmp = sandbox.web3.eth.contract(contractA_ABI).at(addressA);
    
    assert.equal(contractA.getName(), "ContractA");      
        
    done();
  });
  

  after(function(done) {
    
    /*inf*/console.log(" [sandbox stopping]");
    sandbox.stop(done);

    /*inf*/ var end = new Date().getTime();
    /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
});
