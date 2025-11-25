import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import './WalletPage.css';

/**
 * Fetch the current user's wallet data
 */
const fetchWallet = async () => {
  const { data } = await api.get('/wallets/me/');
  return data;
};

/**
 * Add credit to the wallet
 * @param {number} amount - Amount to add
 */
const addCredit = async (amount) => {
  const { data } = await api.post('/wallets/add-credit/', { amount });
  return data;
};

function WalletPage() {
  const queryClient = useQueryClient();

  // Fetch wallet data
  const { data: wallet, isLoading, isError } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });

  // Mutation to add credit
  const addCreditMutation = useMutation({
    mutationFn: addCredit,
    onSuccess: () => {
      queryClient.invalidateQueries(['wallet']); // Refresh wallet data
    },
    onError: (error) => {
      console.error('Error adding credit:', error);
      alert('Failed to add credit. Please try again.');
    },
  });

  /**
   * Prompt user for credit amount and trigger mutation
   */
  const handleAddCredit = () => {
    const input = prompt("Enter the amount of credit to add (e.g., 500):");

    if (!input || isNaN(input) || parseFloat(input) <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    addCreditMutation.mutate(parseFloat(input));
  };

  /**
   * Placeholder for withdraw functionality
   */
  const handleWithdraw = () => {
    alert("This feature is coming soon!");
  };

  // Loading or error states
  if (isLoading) return <div className="loading-text">Loading your wallet...</div>;
  if (isError) return <div className="error-text">Unable to load wallet data.</div>;

  return (
    <div className="wallet-container">
      
      {/* Header */}
      <header className="wallet-header">
        <h2>My Wallet</h2>
        <p>Manage your balance and track all transactions here.</p>
      </header>

      {/* Wallet Balance Card */}
      <div className="balance-card">
        <p className="balance-card-label">Current Balance</p>
        <h1 className="balance-card-amount">RM {parseFloat(wallet.balance).toFixed(2)}</h1>

        {/* Wallet Actions */}
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

      {/* Transaction History */}
      <div className="transaction-history">
        <h3>Transaction History</h3>
        {wallet.transactions && wallet.transactions.length > 0 ? (
          <div className="transaction-list">
            {wallet.transactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <p className="no-transactions-text">
            You have no transactions yet. Add credit to get started!
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Individual transaction item
 */
const TransactionItem = ({ transaction }) => {
  const { type, amount, timestamp } = transaction;
  const formattedDate = new Date(timestamp).toLocaleString();
  const isPositive = parseFloat(amount) >= 0;

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <p className="transaction-type">{type}</p>
        <p className="transaction-date">{formattedDate}</p>
      </div>
      <div className={`transaction-amount ${isPositive ? 'amount-positive' : 'amount-negative'}`}>
        {isPositive ? '+' : ''}RM {parseFloat(amount).toFixed(2)}
      </div>
    </div>
  );
};

export default WalletPage;
