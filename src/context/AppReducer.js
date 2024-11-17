// Action Types
const SET_THEME_MODE = 'SET_THEME_MODE';
const SET_THEME_SWITCH = 'SET_THEME_SWITCH';

const SET_AMOUNT_FILTER = 'SET_AMOUNT_FILTER';
const SET_WALLET_FILTER = 'SET_WALLET_FILTER';
const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
const SET_NOTE_FILTER = 'SET_NOTE_FILTER';

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

const SET_ICON_ID = 'SET_ICON_ID';
const SET_ICON_IMAGE = 'SET_ICON_IMAGE';
const SET_CURRENCY_ID = 'SET_CURRENCY_ID';
const SET_CURRENCY_CODE = 'SET_CURRENCY_CODE';

const SET_CATEGORY = 'SET_CATEGORY';
const SET_CATEGORY_SELECT_TYPE = 'SET_CATEGORY_SELECT_TYPE';
const SET_CATEGORY_NAVIGATION = 'SET_CATEGORY_NAVIGATION';

const SET_WALLET = 'SET_WALLET';
const TRANSCTION_DATA = 'TRANSCTION_DATA';
const TRANSCTION_NOTE = 'TRANSCTION_NOTE';
const SET_DATE_RANGE = 'SET_DATE_RANGE';
const GLOBAL_REFRESH = 'GLOBAL_REFRESH';
const SET_CATEGORY_ICON = 'SET_CATEGORY_ICON';



// Reducer
export default (state, action) => {
  switch (action.type) {
    // Theme actions
    case SET_THEME_MODE:
      return {
        ...state,
        theme: {
          ...state.theme,
          themeMode: action.payload,
        },
      };
    case SET_THEME_SWITCH:
      return {
        ...state,
        themeSwitch: action.payload,
      };

    // Transaction Filter actions
    case SET_AMOUNT_FILTER:
      return {
        ...state,
        transactionFilter: {
          ...state.transactionFilter,
          amountFilterType: action.payload.amountFilterType,
          amount: action.payload.amount,
        },
      };
    case SET_WALLET_FILTER:
      return {
        ...state,
        transactionFilter: {
          ...state.transactionFilter,
          walletFilterType: action.payload.walletFilterType,
          wallet: action.payload.wallet,
        },
      };
    case SET_CATEGORY_FILTER:
      return {
        ...state,
        transactionFilter: {
          ...state.transactionFilter,
          categoryFilter: action.payload,
        },
      };
    case SET_NOTE_FILTER:
      return {
        ...state,
        transactionFilter: {
          ...state.transactionFilter,
          note: action.payload,
        },
      };

    // User actions
    case SET_USER:
      return {
        ...state,
        userId: action.payload.userId,
        userRole: action.payload.userRole,
        userEmail: action.payload.userEmail,
        userName: action.payload.userName,
      };
    case CLEAR_USER:
      return {
        ...state,
        userId: null,
        userRole: null,
        userEmail: null,
        userName: null,
      };

    // Icon actions
    case SET_ICON_ID:
      return {
        ...state,
        selectIconId: action.payload,
      };
    case SET_ICON_IMAGE:
      return {
        ...state,
        selectIconImage: action.payload,
      };

    // Currency actions
    case SET_CURRENCY_ID:
      return {
        ...state,
        selectCurrencyId: action.payload,
      };
    case SET_CURRENCY_CODE:
      return {
        ...state,
        selectCurrencyCode: action.payload,
      };

      case GLOBAL_REFRESH:
        return {
          ...state,
          reFresh: action.payload,
        };

    // Category Icon action
    case SET_CATEGORY_ICON:
      return {
        ...state,
        categoryIcon: action.payload, // Update the categoryIcon in the state
      };

    // Category actions
    case SET_CATEGORY:
      return {
        ...state,
        categoryId: action.payload.categoryId,
        categoryName: action.payload.categoryName,
        categoryImage: action.payload.categoryImage,
      };
    case SET_CATEGORY_SELECT_TYPE:
      return {
        ...state,
        categorySelectType: action.payload,
      };
    case SET_CATEGORY_NAVIGATION:
      return {
        ...state,
        categoryBackNavigation: action.payload,
      };

    // Wallet actions
    case SET_WALLET:
      return {
        ...state,
        walletId: action.payload.walletId,
        walletName: action.payload.walletName,
        walletImage: action.payload.walletImage,
      };

    //  TRANSCTION action
      case TRANSCTION_DATA:
        return {
          ...state,
          transactionId: action.payload.transactionId,
          transactionAmount: action.payload.transactionAmount,
          transactionNote: action.payload.transactionNote,
          transactionDate: action.payload.transactionDate,
        };

        case SET_DATE_RANGE:
          return {
            ...state,
            dateRangeApply: action.payload,
          };
      

    // Transaction Note
    case TRANSCTION_NOTE:
      return {
        ...state,
        transactionNote: action.payload,
      };

    default:
      return state;
  }
};
