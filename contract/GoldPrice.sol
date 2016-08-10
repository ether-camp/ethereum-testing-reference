contract SupportsSetPrice { function setCallbackPrice(uint256 setPrice); }
contract GoldPrice {
  uint public price = 10;
  address callbackAddress = 0x11111111111111111111111111111111;

  function GoldPrice() {
  }

  function getPriceWithParameter(uint input) returns (uint) {
    return price;
  }

  function notifyCallback() {
    SupportsSetPrice(callbackAddress).setCallbackPrice(price);
  }
}
