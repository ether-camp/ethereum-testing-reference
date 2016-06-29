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
  
  
  it('test-sum', function(done) {
	  /*inf*/console.log(" [test-sum]");
	  
	  /* Call to deployed math contract */
	  result = math.sum(2, 2);		
	  
	  console.log("filtering");
	  var filter = sandbox.web3.eth.filter("sum");
      filter.watch(function(error, result){
		if (!error)
			console.log(result);
		else 
			console.log(error); 	
	  });
	  
	  
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
