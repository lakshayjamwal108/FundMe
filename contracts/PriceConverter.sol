

// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{

function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) {

        (, int256 price,,,)=priceFeed.latestRoundData(); //get price of ETH in $ in terms of gwei
        return uint256(price * 10000000000); //convert gwei $ to wei i.e. from 8 to 18 decimal places
     }
     function getConversionRate(uint256 ethAmount,AggregatorV3Interface priceFeed) internal view returns(uint256) {
         uint256 ethPrice= getPrice(priceFeed);
         uint256 ethAmountInUsd = (ethPrice*ethAmount)/1e18;
         return ethAmountInUsd;
     }
     
}