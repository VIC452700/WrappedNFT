// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC20} from "./ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("SpaceCredit", "SPC", 6) {
        uint256 _totalSupply = 1000000000 * 10 ** 6;
        _mint(msg.sender, _totalSupply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
