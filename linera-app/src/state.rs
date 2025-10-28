use async_graphql::SimpleObject;
use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};

/// A single bet entry
#[derive(Clone, Debug, serde::Deserialize, serde::Serialize, SimpleObject)]
pub struct Bet {
    pub better: String, // Owner serialized as string
    pub amount: u64,
    pub prediction: bool,
    pub resolved: bool,
}

/// The prediction market application state.
#[derive(RootView, SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct PredictionMarketState {
    /// Counter for bet IDs
    #[graphql(skip)]
    pub bet_counter: RegisterView<u64>,
    /// Mapping from bet ID to bet
    #[graphql(skip)]
    pub bets: MapView<u64, Bet>,
}

