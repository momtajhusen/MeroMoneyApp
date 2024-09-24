const initialState = {
  theme: {
    themeMode: 'dark',
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

  // Wallet-related state
  walletId: null,
  walletName: null,

  // Note
  transactionNote: null,
};

export default initialState;
