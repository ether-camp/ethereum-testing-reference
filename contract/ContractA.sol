import "std.sol";

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

}