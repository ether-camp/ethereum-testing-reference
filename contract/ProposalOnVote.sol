

contract ProposalOnVote{
 
  string proposalText;
   
  uint votedYes = 0;
  uint votedNo = 0;
  
  mapping (address => bool) voted;
  
  // save already voted
  
  function ProposalOnVote(string text){
	proposalText = text;
  }
  
  function getProposalText() constant returns (string result){
     result = proposalText;
  }
  

  function voteYes(){
  
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedYes;  
  }
  
  function voteNo(){
  
	// todo check that the voter doesn't voted yet
	++votedNo;  
  }
  
  
  function getVotedYes() constant returns (uint result){
    result = votedYes;
  }

  function getVotedNo() constant returns (uint result){
    result = votedNo;
  }
  
  

}