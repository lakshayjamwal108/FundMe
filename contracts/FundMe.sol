// SPDX-License-Identifier: MIT
// Pragma
pragma solidity 0.8.18;

// imports
import {PriceConverter} from "./PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

// error codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts
contract FundMe{

    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    
    address[] private s_funders;
    address private immutable i_owner;
    
    AggregatorV3Interface private s_priceFeed;
    mapping(address => uint256) private s_addressToAmountFunded;
    
    using PriceConverter for uint256;
  
    modifier onlyOwner(){
    //require(msg.sender == i_owner, "Sender i not owner!");
          if(msg.sender != i_owner){ revert FundMe__NotOwner(); }
          _;
    }

    
    
    constructor(address pricefeed){
        i_owner=msg.sender;
        //address pricefeed = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
        s_priceFeed=AggregatorV3Interface(pricefeed);
    }

        receive() external payable{
      
      fund();

    }

    fallback() external payable {

      fund();

    }
    

    function fund() public payable {
       console.log("First line of fund executed");
       require(msg.value.getConversionRate(s_priceFeed)>=MINIMUM_USD,"Didn't send enough ETH");
       s_funders.push(msg.sender);
       console.log("Push of fund executed");
       s_addressToAmountFunded[msg.sender]+=msg.value;
       console.log(msg.sender," Funded amount ",msg.value);
      //console.log("Aggregatorv3Interface version ",getVersion());
    }
   // function getVersion() internal  view returns (uint256){
   //     return AggregatorV3Interface(s_priceFeed).version();
   //   }
   function withdraw() public payable onlyOwner {
     for(uint256 funderIndex = 0 ; funderIndex<s_funders.length; funderIndex++)
     {
        address funder=s_funders[funderIndex];
        s_addressToAmountFunded[funder]=0;
     }
        s_funders= new address[](0);

        (bool callSuccess, )= payable(msg.sender).call{ value: address(this).balance}("");
        require(callSuccess,"Call Failed");
   }
   function cheaperWithdraw() public payable onlyOwner{
      address[] memory funders = s_funders;
      for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
        address funder = funders[funderIndex];
        s_addressToAmountFunded[funder] = 0;

      }
      s_funders = new address[](0);
      (bool success, ) = i_owner.call{value: address(this).balance}("");
      require(success);

   }

   function getOwner() public view returns (address){
    return i_owner;
   }

   function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];

   }

   function getAddressToAmountFunded(address funder) public view returns (uint256) {
    return s_addressToAmountFunded[funder];

   }
   function getPriceFeed() public view returns (AggregatorV3Interface){
    return s_priceFeed;

   }

}