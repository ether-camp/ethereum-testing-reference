

contract ProposalOnVote{

  address owner;
  string proposalText;
   
  uint votedYes = 0;
  uint votedNo = 0;
  
  mapping (address => bool) voted;

  bool finished = false;
  
  // save already voted
  
  function ProposalOnVote(string text){
	owner = msg.sender;
    proposalText = text;
  }
  
  function getProposalText() /* Modifiers */
                             constant 
                             returns (string result){
     result = proposalText;
  }
  

  /**
   * Description: vote yes on the proposal
   */
  function voteYes(){
  
    if (finished) throw;
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedYes;  
  }
  

  /**
   * Description: vote yes on the proposal
   */
  function voteNo(){

    if (finished) throw;
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedNo;  
  }
  
  
  /**
   * Description: check how many voted yes
   */
  function getVotedYes() /* Modifiers */
                         constant 
                         returns (uint result){
    result = votedYes;
  }

  /**
   * Description: check how many voted no
   */
  function getVotedNo() /* Modifiers */
                        constant 
                        returns (uint result){
    result = votedNo;
  }
  
  /**
   * Description: check if the vote process is 
                  finished
   */
  function isFinished() /* Modifiers */
                        constant 
                        returns (bool result){
    result = finished;
  }
  
  /**
   * Description: owner can finish the vote proces 
   */  
  function finishTheVote(){
    if (owner != msg.sender) throw;
    finished = true;
  }

  /**
   * Description: check if the proposal was accepted 
   */  
  function isAccepted() /* Modifiers */
                        constant 
                        returns (string result){
                        
    if (!finished) result = "IN PROGRESS";
    
    if (votedYes > votedNo) result = "ACCEPTED";
    else result = "REJECTED";
  }
  
  
}