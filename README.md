# Ethereum Testing Reference

```
This suite of test cases is the complete demonstartion 
of simple Ethereum testing system for Solidity smart 
contracts.
```

##  Why it is cool ? 

* No Peer end point required
* Start Testing in 3 seconds.
* Completely based javascript
* Paralel running 
* Cool report generated: 
* Running smooth on this [OS list](#tested-os).

![Image of Ethereum testing report](http://i.imgur.com/ZcA3JMT.png)

##  Testing Structure: 
```
To define a test in that suite paradigm 
all you need is the test case file and 
the json file to configure the sandbox
to run it: 

[test-folder]
  |-- .
  |-- math-test.js
  |-- ethereum.json


```

##  How to run the complete suite ?  
```
git clone https://github.com/ether-camp/ethereum-testing-reference
cd ethereum-testing-reference
npm install 
npm test
```

##  How to run the single testcase ?  
```
git clone https://github.com/ether-camp/ethereum-testing-reference
cd ethereum-testing-reference
npm install
npm install mocha -g 
mocha test test/math/math-test.js
```

## Can I run it on Travis ? 

```
yes you can and obviously on any 
continius integration system.
here is demo sample, just for 
that subject: 
```

https://github.com/ether-camp/ethereum-test-travis




##  What test cases are included ?  

### Simple Solidity contract  
[math-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/math/math-test.js)
```
Testing for simple contract calls like: 

	function sum(uint a, uint b) returns (uint result){	    
		result = a + b;
	}
```

### More Complex contract state management
[ProposalOnVote-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/vote/ProposalOnVote-test.js)
```
Testing for contract state management.
The simple voting system: 

  function voteYes(){
  
    if (finished) throw;
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedYes;  
  }
```

### Inter contract communication

[chain-call-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/chain/chain-call-test.js)
```
Contract call to contract, 
NameReg usage...
```

## Detailed Explanation

```
While doing testing we want to focus mostly on 
our buisness logic and forget everything that 
is related to infrastrucure: no network , no 
peers and as much as possible no config involved.


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

##### Here is how it looks like in code:  


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
  },  function(err, contract) {
        
        
        // callback for deployment finish 		
        if (err) {
            done(err);
        } else if (contract.address){
  		
  	     // save contract reference 
  	     // in global var
  	     math = contract;
  	     done();
	}			
  });	  

```



## ethereum.json - sandbox configuration file: 

Check the full example here: [ethereum.json](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/chain/ethereum.json)

#### How to add an account to the sandbox
```json
"0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826": {
  "name": "fellow-1", 
  "balance": 1000000000000000000000000,
  "nonce": "1430",
  "pkey": "cow",
  "default": true
}

```

#### How to add predepolyed contract to the sandbox

```json
"0x0860a8008298322a142c09b528207acb5ab7effc": {
        "balance": 0,
        "source": "predeployed/name_reg.sol"
 }
```


## Want to help ? 
```
We are looking for people who wants to 
add testcases demonstrating best practice, 
good bitcoins promised for help.

Ask ether.camp slack.
```
[Go to Slack](www.ether.camp)


## Tested OS: 

OS Name | Version
------------ | -------------
 Ubuntu | 14.04+
 Fedora | 24
 CentOS | 7
 Max    | El Capitan, 10.11.5 
 Windows | (Not supported Yet) :grin:

*. node.js ver >= 4


## More ? 

Ping us on  [Slack](www.ether.camp)
