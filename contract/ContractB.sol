import "std.sol";

contract ContractB is named("ContractB"){

    address owner;
    string  name = "ContractB";
    
    function ContractB() {
    
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