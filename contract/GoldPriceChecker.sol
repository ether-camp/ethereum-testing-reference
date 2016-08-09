contract GoldPrice{function GoldPrice();function price()constant returns(uint256 );function notifyCallback();function getPriceWithParameter(uint input) returns(uint);}

contract GoldPriceChecker {
  uint public callbackPrice = 100;

  function GoldPriceChecker(address goldPriceContractAddress) {
    goldPriceContract = goldPriceContractAddress;
  }

  function getGoldPriceHappinessMeter() returns (uint) {
    uint feedPrice = GoldPrice(goldPriceContract).price();
    if (feedPrice > 200) {
      return 1;
    } else {
      return 2;
    }
  }

  function executeGetPriceAsCallback() {
    GoldPrice(goldPriceContract).notifyCallback();
  }
  
  function setCallbackPrice(uint256 setPrice) {
    callbackPrice = setPrice;
  }

  function() {
  }

  address goldPriceContract;
}
