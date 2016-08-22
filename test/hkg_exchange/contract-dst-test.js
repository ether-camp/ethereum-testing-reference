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
var hackerGold;
  
   it('init-hkg', function() {
    return contracts.HackerGold.new()
    
     .then(function(contract) {
     
       if (contract.address){
   
         hackerGold = contract;
         return true;      
      } else {
        
        throw new Error('No contract address');
      }        
    });
  });
  
  it('init-hkg-exchange', function() {

    return contracts.HKGExchange.new()
    
       .then(function(contract) {
    
               if (contract.address){

                 exchage = contract;
                 
               } else {
                 
                 throw new Error('No contract address');
               }  
              
               return true;               
      });
  });
   

   it('enlist', function() {


    return exchage.enlist("Merkle3", '0xed2a3d9f938e13cd947ec05abc7fe734df8dd826',
    {
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      value: sandbox.web3.toWei(0, 'ether')
    })
    
    .then(function (txHash) {
        
        return workbench.waitForReceipt(txHash);
    })
    
    .then(function (reciept) {
    
        var exist    = exchage.isExist('Merkle3')
        assert.equal(exist,    true);

        
        exist = exchage.isExist('Merkle5')
        assert.equal(exist, false);
        
        return true;
        
    })        
  });
  


});
