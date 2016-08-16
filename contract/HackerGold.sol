



import "StandardToken.sol";

/**
 *
 * Hacker gold is the official token of 
 * the <hack.ether.camp> hackathon. 
 *
 * todo: brief explained
 *
 * todo: white paper link
 *
 */
contract HackerGold is StandardToken{


    // todo sale period : before / after

    // scale param for number of tokens per ether 


    /**
     *
     */
    function createToken(){
    
        if (msg.value == 0) throw;
    
        
        uint token = msg.value * 20;
        totalSupply += token;
        balances[msg.sender] += token;        
    }
    

}