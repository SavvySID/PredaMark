import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About PredaMark</h1>
        <p className="hero-subtitle">
          The future of prediction markets with a modern, secure, and user-friendly experience
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>What is PredaMark?</h2>
          <p>
            PredaMark is a decentralized prediction market platform that allows users to trade on the outcomes 
            of real-world events. Our platform is designed for performance and security while keeping the user experience simple.
          </p>
          <p>
            Whether you're predicting the outcome of elections, sports events, cryptocurrency prices, or technological 
            developments, PredaMark provides a secure and confidential environment for your trading activities.
          </p>
        </div>

        

        <div className="about-section">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Connect your wallet and start trading on PredaMark with full confidentiality protection.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Browse Markets</h3>
                <p>Explore prediction markets across politics, sports, crypto, technology, and more categories.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Place Bets</h3>
                <p>Place your predictions using your connected wallet on supported networks.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Collect Winnings</h3>
                <p>Automatically receive payouts when your predictions are correct, all while maintaining privacy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe that prediction markets are a powerful tool for aggregating information and creating 
            more accurate forecasts about future events. By combining the transparency of blockchain technology 
            with the privacy of confidential computing, PredaMark creates a new paradigm for prediction markets 
            that protects user privacy while maintaining market integrity.
          </p>
          <p>
            Our goal is to democratize access to prediction markets while ensuring that users can participate 
            without compromising their privacy or exposing their trading strategies to competitors.
          </p>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-logo">⚛️</div>
              <h3>React</h3>
              <p>Modern frontend framework for responsive user interfaces</p>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🔗</div>
              <h3>Ethers.js</h3>
              <p>Ethereum library for blockchain interactions and wallet connectivity</p>
            </div>
            <div className="tech-item">
              <div className="tech-logo">🛠️</div>
              <h3>Hardhat</h3>
              <p>Development environment for smart contract testing and deployment</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to start making predictions? Join PredaMark today and experience a streamlined prediction market.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Start Trading</button>
            <button className="cta-btn secondary">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
