// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authRedux from './authRedux';
// import accountRedux from './accountRedux';
// import businessRedux from './businessRedux';
// import companyRedux from './companyRedux';
// import servicesRedux from './servicesRedux';
// import commonRedux from './commonRedux';

const store = configureStore({
  reducer: {
    authenticationRedux: authRedux,
    // account: accountRedux,
    // business: businessRedux,
    // company: companyRedux,
    // services: servicesRedux,
    // common: commonRedux
  },
});

export default store;
