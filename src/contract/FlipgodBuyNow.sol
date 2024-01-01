// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract FlipgodBuyNow {
    function buyNow(address marketContract, bytes calldata marketCallData) external payable returns (bool, bytes memory) {
        (bool result, bytes memory data) = marketContract.delegatecall{gas: gasleft()}(marketCallData);
        return (result, data);
    }
}