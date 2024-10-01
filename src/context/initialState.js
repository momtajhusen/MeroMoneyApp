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

  // Note
  transactionNote: null,

  transactionFilter: {
    amountFilterType: 'All', // Options: All, Over, Under, Between, Exact
    amount: { min: null, max: null, exact: null },
    walletFilterType: 'All', // Options: All, Over, Under, Between, Exact
    wallet: { min: null, max: null, exact: null },
    note: '', // The note input filter
    categoryFilter: 'Income', // Options: All Categories, All Income, All Expenses
  },

};

export default initialState;
