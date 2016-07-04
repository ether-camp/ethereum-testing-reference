import "std.sol";

/**************************************************/
contract NameRegInterface {    
  function addressOf(bytes32 name) constant returns (address addr) {}
}

contract ContractBInterface {
    
    function getName()  /* Modifiers*/
                         constant 
                         returns (string result){}
}

/**************************************************/

contract ContractA is named("ContractA"){

    address owner;
    string  name = "ContractA";
    
    function ContractA() {
    
        owner = msg.sender;
    }
    
    /**
     * Description: getter for the owner, 
     *              initiated in the constructor
     */
    function getOwner()  /* Modifiers*/
                         constant 
                         returns (address result){
        result = owner;
    }

    /**
     * Description: getter for the name 
     *              initiated in the constructor
     */
    function getName()  /* Modifiers*/
                         constant 
                         returns (string result){
        result = name;
    }
    
    function resolveAddress(bytes32 name) /* Modifiers*/
                                         constant
                                         returns (address result){
       address nameRegAddress = 0x0860a8008298322a142c09b528207acb5ab7effc;                                          
       NameRegInterface nameReg = NameRegInterface(0x0860a8008298322a142c09b528207acb5ab7effc);
       
       result = nameReg.addressOf(name);
    }

}