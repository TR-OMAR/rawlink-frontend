import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import mutation hooks
import api from '../services/api';
import './WalletPage.css'; // Import the new CSS

// --- Function to fetch wallet data (No Change) ---
const fetchWallet = async () => {
  const { data } = await api.get('/wallets/me/');
  return data;
};

// --- NEW Function to add credit ---
const addCredit = async (amount) => {
  const { data } = await api.post('/wallets/add-credit/', { amount });
  return data;
};

function WalletPage() {
  const queryClient = useQueryClient(); // Get the query client

  const { data: wallet, isLoading, isError } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });

  // --- NEW Mutation for adding credit ---
  const addCreditMutation = useMutation({
    mutationFn: addCredit,
    onSuccess: (updatedWallet) => {
      // 1. Invalidate the 'wallet' query to force a re-fetch
      queryClient.invalidateQueries(['wallet']);
      // 2. Or, for a faster update, we can manually set the cache:
      // queryClient.setQueryData(['wallet'], updatedWallet);
    },
    onError: (error) => {
      console.error('Error adding credit:', error);
      alert('Failed to add credit. Please try again.');
    },
  });

  // --- UPDATED: Handle the 'Add Credit' button ---
  const handleAddCredit = () => {
    const amount = prompt("How much credit would you like to add? (e.g., 500)");
    
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid, positive number.");
      return;
    }
    
    // Call the mutation
    addCreditMutation.mutate(amount);
  };

  // Handle the 'Withdraw' button (non-functional for now)
  const handleWithdraw = () => {
    alert("This feature is not yet implemented.");
  };

  // --- Render section (No Change) ---
  if (isLoading) {
    return <div className="loading-text">Loading your wallet...</div>;
  }

  if (isError) {
    return <div className="error-text">Error fetching wallet data.</div>;
  }

  return (
    <div className="wallet-container">
      <header className="wallet-header">
        <h2>My Wallet</h2>
      </header>

      <div className="balance-card">
        <p className="balance-card-label">Current Balance</p>
        <h1 className="balance-card-amount">
          RM {parseFloat(wallet.balance).toFixed(2)}
        </h1>
        <div className="wallet-actions">
          <button className="wallet-button button-withdraw" onClick={handleWithdraw}>
            Withdraw
          </button>
          <button 
            className="wallet-button button-add" 
            onClick={handleAddCredit}
            disabled={addCreditMutation.isLoading}
          >
            {addCreditMutation.isLoading ? 'Adding...' : 'Add Credit'}
          </button>
        </div>
      </div>

      <div className="transaction-history">
        <h3>Transaction History</h3>
        
        {wallet.transactions && wallet.transactions.length > 0 ? (
          <div className="transaction-list">
            {wallet.transactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <p className="no-transactions-text">You have no transactions yet.</p>
        )}
      </div>
    </div>
  );
}

// --- TransactionItem Component (No Change) ---
const TransactionItem = ({ transaction }) => {
  const { type, amount, timestamp } = transaction;
  const formattedDate = new Date(timestamp).toLocaleString();
  const isPositive = parseFloat(amount) >= 0;
  const amountClass = isPositive ? 'amount-positive' : 'amount-negative';

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <p className="transaction-type">{type}</p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
      <div className={`transaction-amount ${amountClass}`}>
        {isPositive ? '+' : ''}RM {parseFloat(amount).toFixed(2)}
      </div>
    </div>
  );
}

export default WalletPage;