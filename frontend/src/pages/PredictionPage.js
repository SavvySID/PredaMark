import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { connectWalletSafely } from '../utils/wallet';
import PriceChart from '../components/PriceChart';
import './PredictionPage.css';

const PredictionPage = () => {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState('yes');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  // Removed unused walletAddress state to satisfy linter
  const [walletConnected, setWalletConnected] = useState(false);
  const [recentBets, setRecentBets] = useState([]);

  useEffect(() => {
    // Mock market data - replace with actual API call
    setMarket({
      id: id || '1',
      question: 'Will Bitcoin reach $100,000 by end of 2025?',
      description: 'This market will resolve to Yes if Bitcoin reaches $100,000 USD or higher at any point before December 31, 2025.',
      endDate: 'Dec 31, 2025',
      volume: '$2,450,000',
      liquidity: '$1,200,000',
      yesPrice: 0.65,
      noPrice: 0.35,
      yesChange: '+5%',
      noChange: '-5%',
      chartData: [
        { date: 'Jan', value: 7.2 },
        { date: 'Feb', value: 12.8 },
        { date: 'Mar', value: 9.4 },
        { date: 'Apr', value: 15.6 },
        { date: 'May', value: 11.2 },
        { date: 'Jun', value: 8.7 },
        { date: 'Jul', value: 13.4 },
        { date: 'Aug', value: 10.8 },
        { date: 'Sep', value: 16.2 },
        { date: 'Oct', value: 12.1 },
        { date: 'Nov', value: 9.8 },
        { date: 'Dec', value: 6.5 }
      ]
    });
    
    // Check if wallet is already connected
    checkWalletConnection();

    // Simulate real-time price updates
    const priceUpdateInterval = setInterval(() => {
      setMarket(prev => {
        if (!prev) return prev;
        
        const randomChange = (Math.random() - 0.5) * 0.02; // ±1% change
        const newYesPrice = Math.max(0.1, Math.min(0.9, prev.yesPrice + randomChange));
        const newNoPrice = 1 - newYesPrice;
        
        return {
          ...prev,
          yesPrice: newYesPrice,
          noPrice: newNoPrice,
          yesChange: randomChange >= 0 ? `+${(randomChange * 100).toFixed(1)}%` : `${(randomChange * 100).toFixed(1)}%`,
          noChange: randomChange <= 0 ? `+${(-randomChange * 100).toFixed(1)}%` : `${(-randomChange * 100).toFixed(1)}%`
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(priceUpdateInterval);
  }, [id]);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      await connectWalletSafely();
      setWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet.');
    }
  };

  const handleBet = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Mock contract interaction - replace with actual contract
      const contract = new ethers.Contract(
        '0x42dB46bD5EaF31e0E3DD2acd3324978EdD14965c',
        [
          {
            "inputs": [
              {"internalType": "bool", "name": "_prediction", "type": "bool"}
            ],
            "name": "placeBet",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        signer
      );

      // Place the bet
      const tx = await contract.placeBet(selectedOutcome === 'yes', {
        value: ethers.parseEther(amount)
      });
      
      await tx.wait();
      
      // Update market prices (mock)
      setMarket(prev => ({
        ...prev,
        yesPrice: selectedOutcome === 'yes' ? prev.yesPrice + 0.01 : prev.yesPrice - 0.01,
        noPrice: selectedOutcome === 'no' ? prev.noPrice + 0.01 : prev.noPrice - 0.01,
        volume: `$${(parseFloat(prev.volume.replace(/[$,]/g, '')) + parseFloat(amount) * 100).toLocaleString()}`
      }));
      
      // Add to recent bets
      const newBet = {
        id: Date.now(),
        outcome: selectedOutcome.toUpperCase(),
        amount: amount,
        price: selectedOutcome === 'yes' ? market.yesPrice : market.noPrice,
        timestamp: new Date().toLocaleTimeString(),
        txHash: tx.hash
      };
      setRecentBets(prev => [newBet, ...prev.slice(0, 4)]); // Keep last 5 bets
      
      alert(`✅ Bet placed successfully!\n${selectedOutcome.toUpperCase()} for ${amount} ROSE\nTransaction: ${tx.hash}`);
      setAmount('');
    } catch (error) {
      console.error('Bet failed:', error);
      alert(`❌ Bet failed: ${error.message}`);
    }
    setLoading(false);
  };

  if (!market) {
    return <div className="loading">Loading market...</div>;
  }

  return (
    <div className="prediction-page">
      <div className="market-header">
        <div className="market-info">
          <h1 className="market-question">{market.question}</h1>
          <p className="market-description">{market.description}</p>
          <div className="market-stats">
            <div className="stat">
              <span className="stat-label">Volume</span>
              <span className="stat-value">{market.volume}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Liquidity</span>
              <span className="stat-value">{market.liquidity}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Ends</span>
              <span className="stat-value">{market.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="market-content">
        <div className="chart-section">
          <PriceChart 
            data={market.chartData}
            currentPrice={market.yesPrice * 100}
            priceChange={parseFloat(market.yesChange)}
          />
        </div>

        <div className="trading-section">
          <div className="outcome-selector">
            <button 
              className={`outcome-btn yes ${selectedOutcome === 'yes' ? 'active' : ''}`}
              onClick={() => setSelectedOutcome('yes')}
            >
              <div className="outcome-info">
                <span className="outcome-label">Yes</span>
                <span className="outcome-price">{market.yesPrice * 100}¢</span>
                <span className={`outcome-change ${market.yesChange.startsWith('+') ? 'positive' : 'negative'}`}>
                  {market.yesChange}
                </span>
              </div>
            </button>
            <button 
              className={`outcome-btn no ${selectedOutcome === 'no' ? 'active' : ''}`}
              onClick={() => setSelectedOutcome('no')}
            >
              <div className="outcome-info">
                <span className="outcome-label">No</span>
                <span className="outcome-price">{market.noPrice * 100}¢</span>
                <span className={`outcome-change ${market.noChange.startsWith('+') ? 'positive' : 'negative'}`}>
                  {market.noChange}
                </span>
              </div>
            </button>
          </div>

          <div className="bet-form">
            <div className="form-group">
              <label>Amount (ROSE)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>
            
            <div className="bet-summary">
              <div className="summary-row">
                <span>Shares</span>
                <span>{amount ? (parseFloat(amount) / (selectedOutcome === 'yes' ? market.yesPrice : market.noPrice)).toFixed(2) : '0'}</span>
              </div>
              <div className="summary-row">
                <span>Max Payout</span>
                <span>{amount ? parseFloat(amount).toFixed(2) : '0'} ROSE</span>
              </div>
            </div>

            {!walletConnected ? (
              <button 
                className="connect-wallet-btn"
                onClick={connectWallet}
              >
                Connect Wallet to Trade
              </button>
            ) : (
              <button 
                className="place-bet-btn"
                onClick={handleBet}
                disabled={!amount || loading}
              >
                {loading ? 'Processing...' : `Buy ${selectedOutcome.toUpperCase()}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {recentBets.length > 0 && (
        <div className="recent-bets-section">
          <h3>Recent Bets</h3>
          <div className="recent-bets-list">
            {recentBets.map(bet => (
              <div key={bet.id} className="recent-bet-item">
                <div className="bet-info">
                  <span className={`bet-outcome ${bet.outcome.toLowerCase()}`}>
                    {bet.outcome}
                  </span>
                  <span className="bet-amount">{bet.amount} ROSE</span>
                  <span className="bet-price">@{bet.price.toFixed(2)}</span>
                </div>
                <div className="bet-time">{bet.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
