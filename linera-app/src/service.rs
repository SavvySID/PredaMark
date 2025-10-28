#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{linera_base_types::WithServiceAbi, views::View, Service, ServiceRuntime};
use prediction_market::{PredictionMarketAbi, PredictionMarketOperation};

use self::state::{Bet, PredictionMarketState};

pub struct PredictionMarketService {
    state: Arc<PredictionMarketState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(PredictionMarketService);

impl WithServiceAbi for PredictionMarketService {
    type Abi = PredictionMarketAbi;
}

impl Service for PredictionMarketService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = PredictionMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            self.state.clone(),
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct MutationRoot {
    runtime: Arc<ServiceRuntime<PredictionMarketService>>,
}

#[Object]
impl MutationRoot {
    async fn place_bet(&self, prediction: bool) -> Vec<u8> {
        let operation = PredictionMarketOperation::PlaceBet { prediction };
        self.runtime.schedule_operation(&operation);
        vec![]
    }

    async fn resolve_bet(&self, bet_id: u64, actual_outcome: bool) -> Vec<u8> {
        let operation = PredictionMarketOperation::ResolveBet { 
            bet_id, 
            actual_outcome 
        };
        self.runtime.schedule_operation(&operation);
        vec![]
    }
}

#[Object]
impl PredictionMarketState {
    async fn bet_count(&self) -> u64 {
        *self.bet_counter.get()
    }
}

