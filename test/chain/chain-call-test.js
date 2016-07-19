/*
 * Testing for ${home}/contract/chain-call-test.sol
 */
var assert = require('assert');

var Sandbox = require('ethereum-sandbox-client');
var helper = require('ethereum-sandbox-helper');

describe('Chain Contract Suite', function() {
  this.timeout(60000);

  var sandbox = new Sandbox('http://localhost:8554');
  var compiled = helper.compile('./contract',  ['ContractA.sol', 'ContractB.sol']);
  var contractA, contractB;

  before(function(done) {
    sandbox.start(__dirname + '/ethereum.json', done);
  });

  /*
    TestCase: test-deploy-a
    Description: Deploy ContractA
  */
  it('test-deploy-a', function(done) {
    console.log(' [test-deploy-a]');

    sandbox.web3.eth.contract(JSON.parse(compiled.contracts['ContractA'].interface)).new(
      {
        /* contract creator */
        from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',

        /* contract bytecode */
        data: '0x' + compiled.contracts['ContractA'].bytecode
      },
      function(err, contract) {
        if (err) done(err);
        else if (contract.address){
          contractA = contract;
          done();
        }
      }
    );
  });

  /*
    TestCase: test-deploy-b
    Description: Deploy ContractB
  */
  it('test-deploy-b', function(done) {
    console.log(' [test-deploy-b]');

    sandbox.web3.eth.contract(JSON.parse(compiled.contracts['ContractB'].interface)).new(
      {
        /* contract creator */
        from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',

        /* contract bytecode */
        data: '0x' + compiled.contracts['ContractB'].bytecode
      },
      function(err, contract) {
        if (err) done(err);
        else if (contract.address){
          contractB = contract;
          done();
        }
      }
    );
  });

  /**
   * TestCase: check-init
   * Description: Trying that the ContractA and
   *              ContractB process was good.
   */
  it('check-init', function(done) {
    console.log(' [check-init]');

    var owner = contractA.getOwner();
    assert.equal(owner, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

    owner = contractB.getOwner();
    assert.equal(owner, '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');

    done();
  });

  /**
   * TestCase: get-address-from-namereg
   * Description: Testing access to ${home}/predeployed/name-reg.sol
   */
  it('get-address-from-namereg', function(done) {
    console.log(' [get-address-from-namereg]');

    var abi = [
      {
        'constant': true,
        'inputs': [
          {
            'name': 'name',
            'type': 'bytes32'
          }
        ],
        'name': 'addressOf',
        'outputs': [
          {
            'name': 'addr',
            'type': 'address'
          }
        ],
        'type': 'function'
      }
    ];

    // Access nameReg predefined in ethereum.json env conf file
    // the address 0x0860a8008298322a142c09b528207acb5ab7effc
    // is hardcoded for that environment
    var nameReg = sandbox.web3.eth.contract(abi).at('0x0860a8008298322a142c09b528207acb5ab7effc');
    var addressA = nameReg.addressOf('ContractA');
    var addressB = nameReg.addressOf('ContractB');

    // get ContractA with   help from namereg
    var contractA_ABI = [{
      'constant': true, 'inputs': [], 'name': 'getName',
      'outputs': [
        {
          'name': 'result',
          'type': 'string'
        }
      ],
      'type': 'function'
    }];

    var contractA_tmp = sandbox.web3.eth.contract(contractA_ABI).at(addressA);

    assert.equal(contractA_tmp.getName(), 'ContractA');

    // get ContractB with help from namereg
    var contractB_ABI = [{
      'constant': true, 'inputs': [], 'name': 'getName',
      'outputs': [
        {
          'name': 'result',
          'type': 'string'
        }
      ],
      'type': 'function'
    }];

    var contractB_tmp = sandbox.web3.eth.contract(contractB_ABI).at(addressB);

    assert.equal(contractB_tmp.getName(), 'ContractB');

    done();
  });

  /**
   * TestCase: contract-call-namereg
   * Description: Contract call contract test case.

                  [ContractA] --[addressOf]--> [NameReg]

                  ContractA ask NameReg for a addressOf()
                  resolving.
   */
  it('contract-call-namereg', function(done) {
    console.log(' [contract-call-namereg]');

    var contractBAddress = contractA.resolveAddress('ContractB');
    assert.equal(contractBAddress,  contractB.address);

    done();
  });

  after(function(done) {
    sandbox.stop(done);
  });
});
