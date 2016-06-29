/*


*/
var _ = require('lodash');
var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');

var start = new Date().getTime();


describe('Math Contract Suite', function() {
  this.timeout(60000);
  var sandbox = new Sandbox('http://localhost:8554');
  
  
  /*inf*/ console.log("Compiling ['Math.sol'] files");
  
  var compiled = helper.compile('./contract', ['Math.sol']);
  
  /*inf*/
	  if (compiled.errors){
		console.log(compiled.errors)
	  }
	  else{
		console.log("Comilation Success");  
		console.log("");
	  }
  /*inf*/
  
  var math;
  
  
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
				math = contract;
				done();
			}			
		});	  
	  
	  /*inf*/ var end = new Date().getTime();
      /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
  
  
  /*
    TestCase: test-sum 
	Description: test call to sum().
  */
  it('test-sum', function(done) {
	  /*inf*/console.log(" [test-sum]");
	  
	  /* Call to deployed math contract */
	  math.sum(2, 2);		
	  
	  console.log("filtering...");

	  /*
	  var filter = sandbox.web3.eth.filter("latest");
      
	  filter.watch(function(error, result){
		if (error) {
			console.log(error);
			return;
		}
		

		console.log("filter fired");
	  });
	  
	  
	  
	  this.timeout(10000);
	  filter.stopWatching();
	  */
	  
	  done();
	  
	  /*inf*/ var end = new Date().getTime();
      /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
  
  
  
  
  after(function(done) {
    
    /*inf*/console.log(" [sandbox stopping]");
	sandbox.stop(done);

	/*inf*/ var end = new Date().getTime();
    /*inf*/ time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
});
