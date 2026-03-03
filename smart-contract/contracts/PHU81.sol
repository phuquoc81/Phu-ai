// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PHU81 Token
 * @dev ERC-20 utility token for the Phu-ai enterprise SaaS platform.
 *
 * Features:
 *  - Fixed initial supply of 1 billion tokens minted to the deployer.
 *  - Owner can mint additional tokens up to MAX_SUPPLY.
 *  - Token holders can burn their own tokens (ERC20Burnable).
 *  - Owner can pause/unpause all transfers (circuit-breaker).
 */
contract PHU81 is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10 ** 18; // 10 billion hard cap

    event TokensMinted(address indexed to, uint256 amount);

    constructor(uint256 initialSupply) ERC20("PHU81 Token", "PHU81") Ownable(msg.sender) {
        require(initialSupply > 0, "PHU81: initial supply must be > 0");
        uint256 mintAmount = initialSupply * 10 ** decimals();
        require(mintAmount <= MAX_SUPPLY, "PHU81: initial supply exceeds max supply");
        _mint(msg.sender, mintAmount);
    }

    /**
     * @dev Mint new tokens to `to`. Only callable by the owner.
     * Total supply must not exceed MAX_SUPPLY.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "PHU81: max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Pause all token transfers. Only callable by the owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers. Only callable by the owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Required override: ERC20Pausable hooks into _update (OZ 5.x pattern)
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
