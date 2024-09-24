export default (state, action) => {
  switch (action.type) {
      case 'SET_THEME_MODE':
        return {
          ...state,
          theme: {
            ...state.theme,
            themeMode: action.payload,
          },
        };

    case 'SET_THEME_SWITCH':
      return {
        ...state,
        themeSwitch: action.payload
      };
    case 'SET_ICON_ID':
      return {
        ...state,
        selectIconId: action.payload
      };
    case 'SET_ICON_IMAGE':
      return {
        ...state,
        selectIconImage: action.payload
      };
    case 'SET_CURRENCY_ID':
      return {
        ...state,
        selectCurrencyId: action.payload
      };
    case 'SET_CURRENCY_CODE':
      return {
        ...state,
        selectCurrencyCode: action.payload
      };
    case 'SET_USER':
      return {
        ...state,
        userId: action.payload.userId,
        userRole: action.payload.userRole,
        userEmail: action.payload.userEmail,
        userName: action.payload.userName,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        userId: null,
        userRole: null,
        userEmail: null,
        userName: null,
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        categoryId: action.payload.categoryId,
        categoryName: action.payload.categoryName,
        categoryImage: action.payload.categoryImage,

      };
      case 'SET_CATEGORY_NAVIGATION':
        return {
          ...state,
          categoryBackNavigation: action.payload
        };
    case 'SET_WALLET':
      return {
        ...state,
        walletId: action.payload.walletId,
        walletName: action.payload.walletName,
      };
    case 'TRANSCTION_NOTE':
      return {
        ...state,
        transactionNote: action.payload,
      };
    default:
      return state;
  }
};
