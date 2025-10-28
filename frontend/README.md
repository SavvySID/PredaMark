# PredaMark Frontend - Linera Integration

This frontend has been updated to support Linera blockchain integration.

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- GraphQL packages (`graphql`, `graphql-request`)
- React dependencies
- Other UI libraries

### 2. Configure Linera Environment

Create a `.env` file in the `frontend/` directory:

```env
# Linera Service Configuration
REACT_APP_LINERA_SERVICE_URL=http://localhost:8080
REACT_APP_LINERA_APPLICATION_ID=your-application-id-here
REACT_APP_LINERA_CHAIN_ID=your-chain-id-here
REACT_APP_LINERA_FAUCET_URL=http://localhost:8079
```

Or update `src/config/linera.js` directly:

```javascript
export const LINERA_SERVICE_URL = 'http://localhost:8080';
export const LINERA_APPLICATION_ID = 'your-application-id';
export const LINERA_CHAIN_ID = 'your-chain-id';
```

### 3. Start Development Server

```bash
npm start
```

Visit `http://localhost:3000`

## Files Created/Modified

### New Files:
- `src/config/linera.js` - Linera configuration and GraphQL queries
- `src/services/lineraService.js` - Linera GraphQL service client
- `src/pages/PredictionPageLinera.js` - Updated page component with Linera integration

### Modified Files:
- `package.json` - Added GraphQL dependencies

## How It Works

### 1. Linera Service (`src/services/lineraService.js`)

The `LineraService` class provides methods to interact with the Linera application:

```javascript
import { lineraService } from '../services/lineraService';

// Get bet count
const count = await lineraService.getBetCount();

// Place a bet
await lineraService.placeBet(true); // true for "yes", false for "no"

// Resolve a bet
await lineraService.resolveBet(0, true); // betId, actualOutcome
```

### 2. Configuration (`src/config/linera.js`)

Defines:
- Connection URLs and IDs
- GraphQL query/mutation strings
- Helper functions

### 3. Updated Components

The PredictionPage component has been updated to:
- Use Linera service instead of ethers.js
- Connect to Linera GraphQL endpoint
- Display connection status
- Show bet count from chain

## Using the Updated Components

### Option 1: Update Existing Page

Replace the imports in `PredictionPage.js`:

```javascript
// Old:
import { connectWalletSafely } from '../utils/wallet';
import { ethers } from 'ethers';

// New:
import { lineraService } from '../services/lineraService';
```

### Option 2: Use New Component

Switch `App.js` to use the new component:

```javascript
import PredictionPageLinera from './pages/PredictionPageLinera';

// Update route:
<Route path="/market/:id" element={<PredictionPageLinera />} />
```

## GraphQL Queries

The frontend uses these GraphQL operations:

### Query Bet Count
```graphql
query {
  betCount
}
```

### Place a Bet
```graphql
mutation {
  placeBet(prediction: true)
}
```

### Resolve a Bet
```graphql
mutation {
  resolveBet(betId: 0, actualOutcome: true)
}
```

## Testing

### Test Linera Connection

1. Start Linera service on port 8080
2. Set your application ID in `.env` or config
3. Visit the prediction page
4. Click "Connect to Linera"
5. You should see "✅ Connected" status

### Test Betting

1. Connect to Linera
2. Select Yes/No outcome
3. Enter amount
4. Click "Buy YES" or "Buy NO"
5. Check recent bets section

## Troubleshooting

### "LINERA_CHAIN_ID and LINERA_APPLICATION_ID must be set"
- Make sure you've deployed your Linera application
- Update the config with the correct IDs
- Restart the dev server after changing `.env`

### "Failed to connect"
- Ensure Linera service is running on port 8080
- Check that your application ID is correct
- Verify your chain ID is valid

### "Query failed"
- Check browser console for detailed error
- Verify GraphQL endpoint is accessible
- Make sure Linera node is running

## Next Steps

1. Deploy the Linera application (see `../linera-app/README.md`)
2. Get your application ID and chain ID
3. Update frontend configuration
4. Start the frontend and test!

## Resources

- [Linera Documentation](https://linera.dev)
- [Linera GitHub](https://github.com/linera-io/linera-protocol)
- [GraphQL Documentation](https://graphql.org/)
