#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use prediction_market::{PredictionMarketAbi, PredictionMarketOperation};
use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use self::state::{Bet, PredictionMarketState};

pub struct PredictionMarketContract {
    state: PredictionMarketState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(PredictionMarketContract);

impl WithContractAbi for PredictionMarketContract {
    type Abi = PredictionMarketAbi;
}

impl Contract for PredictionMarketContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = PredictionMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: ()) {
        // Initialize with empty state
        self.runtime.application_parameters();
        self.state.bet_counter.set(0);
    }

    async fn execute_operation(&mut self, operation: PredictionMarketOperation) {
        match operation {
            PredictionMarketOperation::PlaceBet { prediction } => {
                let bet_counter = *self.state.bet_counter.get();
                let new_bet_counter = bet_counter + 1;
                
                let better = self.runtime.authenticated_signer()
                    .map(|owner| format!("{}", owner))
                    .unwrap_or_else(|| format!("{}", self.runtime.chain_id()));
                
                let bet = Bet {
                    better,
                    amount: 0, // Will be set via funding
                    prediction,
                    resolved: false,
                };
                
                self.state.bets.insert(bet_counter, bet).await;
                self.state.bet_counter.set(new_bet_counter);
            }
            PredictionMarketOperation::ResolveBet { bet_id, actual_outcome } => {
                if let Some(bet) = self.state.bets.get(&bet_id).await.unwrap() {
                    if !bet.resolved && bet.prediction == actual_outcome {
                        // Payout logic - transfer back to better if correct
                        // Note: Actual transfer requires funding mechanism
                        // For now, just mark as resolved
                    }
                    let mut resolved_bet = bet;
                    resolved_bet.resolved = true;
                    self.state.bets.insert(bet_id, resolved_bet).await;
                }
            }
        }
    }

    async fn execute_message(&mut self, _message: ()) {
        // No cross-chain messages needed for prediction market
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}


