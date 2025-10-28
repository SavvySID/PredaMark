use async_graphql::{Request, Response};
use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

/// Binary data stored in the application state.
pub type Bytecode = linera_sdk::linera_base_types::Bytecode;

/// The prediction market application ABI.
pub struct PredictionMarketAbi;

/// Operations that can be sent to the prediction market application.
#[derive(Debug, Deserialize, Serialize)]
pub enum PredictionMarketOperation {
    /// Place a bet on an outcome
    PlaceBet { prediction: bool },
    /// Resolve a bet and payout if correct
    ResolveBet { bet_id: u64, actual_outcome: bool },
}

impl ContractAbi for PredictionMarketAbi {
    type Operation = PredictionMarketOperation;
    type Response = ();
}

impl ServiceAbi for PredictionMarketAbi {
    type Query = Request;
    type QueryResponse = Response;
}


