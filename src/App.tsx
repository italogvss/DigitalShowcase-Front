import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import ThemeModeProvider from './Context/ThemeProvider';
import { Provider } from 'react-redux';
import store from './store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  return (
    <>
    <ToastContainer
              position='bottom-center'
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              theme="colored"
              transition={Slide}
            />
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-Br">
          <ThemeModeProvider>
            
            <Outlet />
          </ThemeModeProvider>
        </LocalizationProvider>
      </Provider>
    </>
  );
}

export default App;
