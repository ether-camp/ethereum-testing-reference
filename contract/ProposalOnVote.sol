

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
  
  function getProposalText() constant returns (string result){
     result = proposalText;
  }
  

  function voteYes(){
  
    if (finished) throw;
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedYes;  
  }
  
  function voteNo(){

    if (finished) throw;
    if (voted[msg.sender]) throw;

    voted[msg.sender] = true;
	++votedNo;  
  }
  
  
  function getVotedYes() constant returns (uint result){
    result = votedYes;
  }

  function getVotedNo() constant returns (uint result){
    result = votedNo;
  }
  
  function isFinished() constant returns (bool result){
    result = finished;
  }
  
  function finishTheVote(){
    if (owner != msg.sender) throw;
    finished = true;
  }

}