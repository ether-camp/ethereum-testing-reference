

contract Math{

    event SumEvent(string ID, uint result);

	function sum(uint a, uint b) returns (uint result){
	
	    
		result = a + b;
		SumEvent("sum", result);
	}
}