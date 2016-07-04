# Ethereum Testing Reference

```
This suite of test cases is complete demonstartion 
of Simple Ethereum testing system for solidity smart 
contracts.
```

##  Why it is cool ? 

* No Peer end point required
* Completely based javascript
* Cool report generated: 

![Image of Ethereum testing report](http://i.imgur.com/ZcA3JMT.png)

##  How to run the suite ?  
```
git clone https://github.com/ether-camp/test-starter
cd test-starter
npm install 
npm test
```

##  What test cases included ?  

### Simple Solidity contract  
https://github.com/ether-camp/ethereum-testing-reference/tree/master/test/math/math.js

### More Complex contract state management
https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/vote/ProposalOnVote-test.js

### Inter contract communication
https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/vote/ProposalOnVote-test.js


## Detailed Explanation

```
While doing testing we want to focus mostly on 
our buisness logic and forget everything that 
is related to infrastrucure: no network , no 
peers and as much as possible config involved.


The perfect test case should look like this: 
 1. Start Sandbox
 2. Deploy contract 
 3. Test method-a call
 4. Assert results.
 5. Test method-b call
 6. Assert results.
      ...
 end. Tear all down

```




```javascript

  // Compile the contracts
  var compiled = helper.compile('./contract', ['Math.sol']);

  // Before starting any testase
  sandbox.start(__dirname + '/ethereum.json', done);

  // Deploy the contract transaction 
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

```







