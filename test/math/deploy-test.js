/*


*/
var _ = require('lodash');
var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');

var start = new Date().getTime();


describe('Deployment', function() {
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
    sandbox.start(__dirname + '/ethereum.json', done);

    var end = new Date().getTime();
    time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
  
  
  
  it('test-deploy', function(done) {
	  console.log("test-1");
	  
		sandbox.web3.eth.contract(JSON.parse(compiled.contracts['Math'].interface)).new({
			/* contract constractor params */ 
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
	  
	  var end = new Date().getTime();
      time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
  
  
  
  after(function(done) {
    sandbox.stop(done);

	var end = new Date().getTime();
    time = (end - start)/1000; console.log(" < " + time  + "s >\n");
  });
});
