pragma solidity ^0.5.0;

import "./Token.sol";


contract EthSwap {
    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokenSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * rate;

        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Available tokens are less than requested amount."
        );
        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "Not Enough token");

        uint256 etherAmount = _amount / rate;

        require(
            address(this).balance >= etherAmount,
            "You don't have sufficient amount."
        );

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}
