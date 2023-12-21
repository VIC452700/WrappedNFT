// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IERC20 {
  /**
   * @dev Returns the amount of tokens in existence.
   */
  function totalSupply() external view returns (uint256);

  /**
   * @dev Returns the token decimals.
   */
  function decimals() external view returns (uint8);

  /**
   * @dev Returns the token symbol.
   */
  function symbol() external view returns (string memory);

  /**
  * @dev Returns the token name.
  */
  function name() external view returns (string memory);

  /**
   * @dev Returns the bep token owner.
   */
  function getOwner() external view returns (address);

  /**
   * @dev Returns the amount of tokens owned by `account`.
   */
  function balanceOf(address account) external view returns (uint256);

  /**
   * @dev Moves `amount` tokens from the caller's account to `recipient`.
   *
   * Returns a boolean value indicating whBNBer the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transfer(address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Returns the remaining number of tokens that `spender` will be
   * allowed to spend on behalf of `owner` through {transferFrom}. This is
   * zero by default.
   *
   * This value changes when {approve} or {transferFrom} are called.
   */
  function allowance(address _owner, address spender) external view returns (uint256);

  /**
   * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
   *
   * Returns a boolean value indicating whBNBer the operation succeeded.
   *
   * IMPORTANT: Beware that changing an allowance with this mBNBod brings the risk
   * that someone may use both the old and the new allowance by unfortunate
   * transaction ordering. One possible solution to mitigate this race
   * condition is to first reduce the spender's allowance to 0 and set the
   * desired value afterwards:
   * https://github.com/BNBereum/EIPs/issues/20#issuecomment-263524729
   *
   * Emits an {Approval} event.
   */
  function approve(address spender, uint256 amount) external returns (bool);

  /**
   * @dev Moves `amount` tokens from `sender` to `recipient` using the
   * allowance mechanism. `amount` is then deducted from the caller's
   * allowance.
   *
   * Returns a boolean value indicating whBNBer the operation succeeded.
   *
   * Emits a {Transfer} event.
   */
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  /**
   * @dev Emitted when `value` tokens are moved from one account (`from`) to
   * another (`to`).
   *
   * Note that `value` may be zero.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted when the allowance of a `spender` for an `owner` is set by
   * a call to {approve}. `value` is the new allowance.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Flash {
    uint256 private _decimal;
    address private _token;
    uint256 private _lastGenerateTime;
    uint256 private _callCountPerDay;

    constructor(address token) {
        _token = token;
        _decimal = IERC20(token).decimals();
    }

    function initialize() external {        
        IERC20(_token).transferFrom(msg.sender, address(this), 30000 * 10 ** _decimal);
    }

    function generate(address to, uint256 storeDate) external {
        if (block.timestamp > _lastGenerateTime + 1 days) {
            _callCountPerDay = 0; 
        }

        require(_callCountPerDay < 5, "Not enabled generate flash more than 5 per day");
        
        if (storeDate <= 30) {
            IERC20(_token).approve(to, 1000 * 10 ** _decimal);
            IERC20(_token).transfer(to, 1000 * 10 ** _decimal);
        } else if (storeDate <= 60) {
            IERC20(_token).approve(to, 800 * 10 ** _decimal);
            IERC20(_token).transfer(to, 800 * 10 ** _decimal);
        } else {
            IERC20(_token).approve(to, 600 * 10 ** _decimal);
            IERC20(_token).transfer(to, 600 * 10 ** _decimal);
        }
        
        _lastGenerateTime = block.timestamp;
        _callCountPerDay++;
    }
}