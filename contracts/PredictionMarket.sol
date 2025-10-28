// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PredictionMarket {
    struct Bet {
        address better;
        uint256 amount;
        bool prediction; // plaintext prediction (temporary, no Oasis dependencies)
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCounter;

    event NewBet(uint256 indexed betId, address indexed better);

    function placeBet(bool _prediction) external payable {
        uint256 betId = betCounter++;

        bets[betId] = Bet({
            better: msg.sender,
            amount: msg.value,
            prediction: _prediction
        });

        emit NewBet(betId, msg.sender);
    }

    function resolveBet(uint256 _betId, bool _actualOutcome) external {
        Bet storage bet = bets[_betId];
        require(bet.better != address(0), "Bet does not exist");

        if (bet.prediction == _actualOutcome) {
            payable(bet.better).transfer(bet.amount * 2);
        }
        delete bets[_betId];
    }

    function nextUnresolvedBetId() public view returns (uint256) {
        for (uint256 i = 0; i < betCounter; i++) {
            if (bets[i].better != address(0)) {
                return i;
            }
        }
        return type(uint256).max;
    }
}