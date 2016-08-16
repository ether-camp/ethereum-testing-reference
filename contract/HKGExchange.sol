
import "HackerGold.sol";
import "ContractDST.sol";

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
    
    HackerGold hackerGold;
    
    function HKGExchange(address hackerGoldAddr){
    
        hackerGold = HackerGold(hackerGoldAddr);
    }
    
    
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
    
    /**
     *
     */
    function delist(){
        // +. only after the event is done
        // +. only by owner of the DSG
    }


    /**
     *
     * buy()
     *
     */
    function buy(string companyName, uint hkg) returns (bool success) {
        
        // check DSG exist 
        if (!isExist(companyName)) throw;
        
        /* 2. Transfer DSG  */
        ContractDST contractDST = ContractDST(company[companyName]);
        
        
        
        /* 1. Transer on HackerGold */
        /* +. Transfer  from sender */
        /* +. check you have enough hacker gold to transfer */
    
    }
    
    
    
    /* todo functions */
    
    // sell();
    // regPlayer();
    
    
    
    
    
}