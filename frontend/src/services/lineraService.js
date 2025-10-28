import { GraphQLClient } from 'graphql-request';
import { getGraphQLEndpoint, GRAPHQL_OPERATIONS } from '../config/linera';

/**
 * Linera GraphQL Service
 * Handles all communication with the Linera application
 */
class LineraService {
  constructor() {
    this.client = null;
    this.endpoint = null;
  }

  /**
   * Initialize the service with the GraphQL endpoint
   */
  initialize() {
    try {
      this.endpoint = getGraphQLEndpoint();
      this.client = new GraphQLClient(this.endpoint);
      console.log('Linera service initialized:', this.endpoint);
    } catch (error) {
      console.error('Failed to initialize Linera service:', error);
      throw error;
    }
  }

  /**
   * Execute a GraphQL query
   * @param {string} query - GraphQL query string
   * @param {object} variables - Variables for the query
   * @returns {Promise<any>}
   */
  async query(query, variables = {}) {
    if (!this.client) {
      this.initialize();
    }
    
    try {
      const data = await this.client.request(query, variables);
      return data;
    } catch (error) {
      console.error('Linera query error:', error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  /**
   * Get current bet count
   * @returns {Promise<number>}
   */
  async getBetCount() {
    const result = await this.query(GRAPHQL_OPERATIONS.BET_COUNT);
    return result.betCount || 0;
  }

  /**
   * Get a specific bet by ID
   * @param {number} betId - The bet ID
   * @returns {Promise<object|null>}
   */
  async getBet(betId) {
    const result = await this.query(GRAPHQL_OPERATIONS.GET_BET(betId));
    return result.bet || null;
  }

  /**
   * Place a bet
   * @param {boolean} prediction - The prediction (true for yes, false for no)
   * @returns {Promise<boolean>}
   */
  async placeBet(prediction) {
    try {
      await this.query(GRAPHQL_OPERATIONS.PLACE_BET(prediction));
      return true;
    } catch (error) {
      console.error('Failed to place bet:', error);
      return false;
    }
  }

  /**
   * Resolve a bet
   * @param {number} betId - The bet ID to resolve
   * @param {boolean} actualOutcome - The actual outcome
   * @returns {Promise<boolean>}
   */
  async resolveBet(betId, actualOutcome) {
    try {
      await this.query(GRAPHQL_OPERATIONS.RESOLVE_BET(betId, actualOutcome));
      return true;
    } catch (error) {
      console.error('Failed to resolve bet:', error);
      return false;
    }
  }
}

// Export singleton instance
export const lineraService = new LineraService();

// Export class for testing
export default LineraService;

