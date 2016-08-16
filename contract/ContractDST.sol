


import "StandardToken.sol";


contract ContractDST is StandardToken{

    address owner; 
        
    mapping (address => uint256) votingRights;

    // The time of the hack.ether.camp 
    uint hackathonStart;
    uint hackathonEnd;
    
    uint constant HACKATHON_5_WEEKS = 1000 * 60 * 60 * 24 * 7 * 5;
    
    // 1 - hkg => dsg qty = hkgPrice
    uint hkgPrice = 200;
    
    /*
     * 
     *  Set date for early adapters
     *
     */ 
    function ContractDST(uint hackathonStart){
    
      hackathonEnd += hackathonStart + HACKATHON_5_WEEKS;            
      owner = msg.sender;  
    }
    
    
    function buyForHackerGold() onlyBeforeEnd returns (bool success) {
    
      // +. validate that the caller is official HKG Exchange
    
      // 1. transfer token 
      
      
      // 2. gain some voting rights
      votingRights[msg.sender] = msg.value;

    }
    
    function votingRightsOf(address _owner) constant returns (uint256 result) {
        result = votingRights[_owner];
    }
    
    
    function getHKGPrice() constant returns (uint result){
        return hkgPrice;
    }


    modifier onlyBeforeEnd() { if (now >= hackathonEnd) throw; _ }
    modifier onlyAfterEnd() { if (now  <= hackathonEnd) throw; _ }
}


 