import { all } from "axios";

const initialState = {
  theme: {
    themeMode: 'darkTheme',
    themeSwitch: true,
  },

  selectIconId: null,
  selectIconImage: null,
  selectCurrencyId: null,
  selectCurrencyCode: null,

  // User-related state
  userId: null,
  userRole: null,
  userEmail: null,
  userName: null,

  // Category-related state
  categoryId: null,
  categoryName: null,
  categoryImage: null,

  categoryBackNavigation: null,
  categorySelectType: null,

  // Wallet-related state
  walletId: null,
  walletName: null,
  walletImage: null,

  // Transtion-related state
  transactionId: null,
  transactionAmount: null,
  transactionNote: null,
  transactionDate: null,

  // Note
  transactionNote: null,

  transactionFilter: {
    amountFilterType: 'All', // Filter type for amount: 'All', 'Over', 'Under', 'Between', 'Exact'
    amount: {
      min: 0, // Minimum value for 'Over', 'Between' filters
      max: 0, // Maximum value for 'Under', 'Between' filters
      exact: 0, // Exact amount filter value for 'Exact'
    },
    walletType: 'All', // Filter for wallet type
    transactionType: 'All', // Filter for transaction type: 'Income', 'Expense', 'All'
    note: '', // Filter for note content
  },

};

export default initialState;
