/**
 * Linera Configuration
 * 
 * Set these environment variables or update these values for your setup
 */

// Linera service URL (defaults to local Linera node)
export const LINERA_SERVICE_URL = process.env.REACT_APP_LINERA_SERVICE_URL || 'http://localhost:8080';

// Your application ID (from deployment) - Set after deploying the Linera app
export const LINERA_APPLICATION_ID = process.env.REACT_APP_LINERA_APPLICATION_ID || 'e476187f6ddfeb9d588c7b45d3db334d006e59e8fa1e38c3f5736f6a4862b690';

// Chain ID (set after getting a chain from faucet)
export const LINERA_CHAIN_ID = process.env.REACT_APP_LINERA_CHAIN_ID || '';

// Faucet URL for testnet
export const LINERA_FAUCET_URL = process.env.REACT_APP_LINERA_FAUCET_URL || 'http://localhost:8079';

// Show helpful message if not configured
if (!LINERA_APPLICATION_ID) {
  console.warn('⚠️ LINERA_APPLICATION_ID not set. Please update your .env file or src/config/linera.js');
}

/**
 * Get the GraphQL endpoint for the application
 */
export function getGraphQLEndpoint() {
  if (!LINERA_CHAIN_ID || !LINERA_APPLICATION_ID) {
    throw new Error('LINERA_CHAIN_ID and LINERA_APPLICATION_ID must be set');
  }
  return `${LINERA_SERVICE_URL}/chains/${LINERA_CHAIN_ID}/applications/${LINERA_APPLICATION_ID}`;
}

/**
 * GraphQL operations for prediction market
 */
export const GRAPHQL_OPERATIONS = {
  // Query bet count
  BET_COUNT: `
    query {
      betCount
    }
  `,
  
  // Get a specific bet
  GET_BET: (betId) => `
    query {
      bet(betId: ${betId}) {
        better
        amount
        prediction
        resolved
      }
    }
  `,
  
  // Place a bet
  PLACE_BET: (prediction) => `
    mutation {
      placeBet(prediction: ${prediction})
    }
  `,
  
  // Resolve a bet
  RESOLVE_BET: (betId, actualOutcome) => `
    mutation {
      resolveBet(betId: ${betId}, actualOutcome: ${actualOutcome})
    }
  `,
};

