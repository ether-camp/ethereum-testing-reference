var assert = require('assert');

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});


workbench.startTesting('ContractDST', function(contracts) {

var log     = console.log;
var sandbox = workbench.sandbox;

var contractDST;
  
  
  it('init', function(done) {

    /*
     *    Start on 07-Nov-2016 10:00 (utc) ts = 1478512800
     */
    contracts.ContractDST.new(1478512800)
    
       .then(function(contract) {
    
       if (contract.address){

         contractDST = contract;
       } else {
         
         done(new Error('No contract address'));
       }        
      
    }).then(done).catch(done);
  });
  
  
  it('buy-for-gold', function(done) {

  
    contractDST.buyForHackerGold({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      value: sandbox.web3.toWei(15, 'ether')
    })
    
    .then(function (txHash) {
      return workbench.waitForReceipt(txHash);
    })

    .then(function () {
    
      contractDST.votingRightsOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826')
       .then(function(value){

            assert.equal(value, sandbox.web3.toWei(15, 'ether'));                       
        }).then(done).catch(done);
      
    });
    
  });
  
  
});
