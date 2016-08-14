


/**
 *    The exchange is valid system 
 *    to purchase tokens from DST
 *    participating on the event.
 * 
 */
contract HKGExchange{

    address owner;  

    /* todo: set address for eventinfo*/
    
    
    mapping (string => address) company;
    
    /**
     * Check if company already enlisted 
     */
    function isExist(string companyName) constant returns (bool result) {
    
        if (company[companyName] == address(0x0)) 
            return false;
        else 
            return true;                  
    }
    

    function enlist(string companyName,  address companyAddress){

        /* todo: 1. only owner can do */
        /* todo: 2. check if exist */
    
        company[companyName] = companyAddress;
    }
    
    
    /* todo functions */
    // buy();
    // sell();
    // regPlayer();
    
}