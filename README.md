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

### Few lines of code to get started
[simple-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/simple/simple-test.js)
* Place `Math.sol` in directory `contract`
* Test it using this code:
```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench();
workbench.startTesting('Math', function(contracts) {
  it('sum-test', function() {
    ...
  });
});
```

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

[MultiSig-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/vote/MultiSig-test.js)
```
This is a MultiSig wallet contract, similar to the one mist uses. 
The only difference is that on MultiSig transactions requiring multiple confirmations, 
the requests can arrive on different blocks. 
This test case also demonstrates how to test events.
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

### Workbench
#### Configuration
When starting the workbench, it supports the following configuration object:
```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {                   //defaults object passed to ether-pudding
    from: '0x'                  //i.e., default from address for contract transactions
  },
  contractsDirectory: '',       //the directory in which the .sol files are stored
  ethereumJsonPath: '',         //if not exists, the generated ethereum.json will be stored here
  initialState: {}              //possible to specify ethereum.json state here instead of in the file
});
```

#### Mocking
The workbench has a mocking framework. It creates a proxy contract that has the same interface but the responses are tailored to your choosing.

##### Mock call return value
1. Create a new proxy using `newMock`.
2. Use `mockCallReturnValue` with the wanted return value on the mocked function.

```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});
workbench.startTesting('GoldPrice', function(contracts) {
  it('tests-mock', function() {
    return contracts.GoldPrice.newMock()
    .then(function(contract) {
      return mockContract.price.mockCallReturnValue(299);
    })
    .then(function(receipt) {
      return mockContract.price.call();
    })
    .then(function(value) {
      assert(value.equals(299));
    });
  });
});
```

##### Mock transaction response
1. Create a new proxy using `newMock`.
2. Use `mockTransactionForward` with the wanted transaction response on the mocked function. Works with the following options object:
```
{
  data: '',               //if data is supplied, this is what is sent and other fields are ignored.,
                          //if data is not supplied, use the following fields:
  contract: '',           //contract object returned from the workbench
  functionName: '',       //function to mock 
  args: ''                //arguments to pass in the forwarded transaction
}
```

```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});
workbench.startTesting(['GoldPrice', 'GoldPriceChecker'], function(contracts) {
  it('tests-mock', function() {
    return contracts.GoldPrice.newMock()
    .then(function(contract) {
      return mockContract.notifyCallback.mockTransactionForward('0x11111111111111111111111111111111', {
        contract: goldPriceChecker,         //goldPriceChecker was created with `new`
        functionName: 'setCallbackPrice',
        args: [23]
      });

      //now when notifyCallback is invoked in a transaction, it will send a follow-up transaction to the goldPriceChecker contract
    });
  });
});
```

##### Conditional return value or transaction response
1. Create a new proxy using `newMock`.
2. Use `mockCallReturnValue` or `mockTransactionForward` as in previous example with an additional parameter as a list of arguments.

```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});
workbench.startTesting('GoldPrice', function(contracts) {
  it('tests-on-args', function() {
    var mockContract;
    return contracts.GoldPrice.newMock()
    .then(function(contract) {
      mockContract = contract;
      return mockContract.getPriceWithParameter.mockCallReturnValue(10);
    })
    .then(function(receipt) {
      return mockContract.getPriceWithParameter.mockCallReturnValue(20, [5]);
    })
    .then(function(receipt) {
      return mockContract.getPriceWithParameter.call(500);
    })
    .then(function(value) {
      assert(value.equals(10));
      return mockContract.getPriceWithParameter.call(5);
    })
    .then(function(value) {
      assert(value.equals(20));
    });
  });
});

```

##### Tracing function calls
1. Create a new proxy using `newMock` with `options.traceFunctionCalls = true`.
2. Use `wasCalled` on the transaction receipt to see if the function was called in that transaction.

```
var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }
});
workbench.startTesting('GoldPrice', function(contracts) {
  it('tests-tracing', function() {
    var mockContract;
    return contracts.GoldPrice.newMock()
    .then(function(contract) {
      mockContract = contract;
      return mockContract.getPriceWithParameter(5);
    })
    .then(function(txHash) {
      return workbench.waitForReceipt(txHash);
    })
    .then(function(receipt) {
      var result = mockContract.getPriceWithParameter.wasCalled(receipt);
      assert(result.called);
      assert(result.args[0].toString(), '5');
    });
  });
});
```

For an extensive example, check out [mock-test.js](https://github.com/ether-camp/ethereum-testing-reference/blob/master/test/mock/mock-test.js).
## Want to help ? 
```
We are looking for people who wants to 
add testcases demonstrating best practice, 
good bitcoins promised for help.

Ask ether.camp slack.
```
[Go to Slack](http://www.ether.camp)


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

Ping us on  [Slack](http://www.ether.camp)
