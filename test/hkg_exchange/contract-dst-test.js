var assert = require('assert');

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});


workbench.startTesting('HKGExchange', function(contracts) {

var log     = console.log;
var sandbox = workbench.sandbox;

var exchage;
  
  
  it('init', function(done) {

    contracts.HKGExchange.new()
    
       .then(function(contract) {
    
               if (contract.address){

                 exchage = contract;
               } else {
                 
                 done(new Error('No contract address'));
               }        
      
    }).then(done).catch(done);
  });
  

  it('enlist', function(done) {


    exchage.enlist("Merkle3", '0xed2a3d9f938e13cd947ec05abc7fe734df8dd826',
    {
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      value: sandbox.web3.toWei(0, 'ether')
    })
    
    .then(function (txHash) {
        return workbench.waitForReceipt(txHash);
    })
    
    .then(function () {
     
      exchage.isExist('Merkle3')
       .then(function(value){

            log("retVal => " + value);
            assert.equal(value, true);                       
        });
        
        
        log("all done ");
      
    }).then(done).catch(done);

  
        
  });



  
});
