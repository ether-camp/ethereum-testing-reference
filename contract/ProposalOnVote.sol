

contract ProposalOnVote{
 
   string proposalText;
   
   uint votedYes = 0;
   uint votedNo = 0;
   
  
  // save already voted
  
  function ProposalOnVote(string text){
	proposalText = text;
  }
  
  function getProposalText() constant returns (string result){
     result = proposalText;
  }
  

  function voteYes(){
  
	// todo check that the voter doesn't voted yet
	++votedYes;  
  }
  
  function getVotedYes() constant returns (uint result){
    result = votedYes;
  }
  
  
  // method voteNo()

}