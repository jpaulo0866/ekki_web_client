import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/main';
import { isAuthenticated } from './services/auth';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Login from './components/login';
import { yellow } from '@material-ui/core/colors';
class App extends Component {
  setTheme = () => {
    return createMuiTheme({
      palette: {
        primary: {
          //main: '#054A91' //Azul Escuro
          //main: '#1EE682' //Verde
          //main: '#197BBD' //Ciano
          main: '#2F52E0' //Azul Platinado
          
        },
        secondary: {
          main: '#D80032'
        },
        error: yellow,
        contrastThreshold: 5,
        tonalOffset: 10,
        type: "light",
        // background: {
        //   default: '#EDF2F4',          
        // }
      },
      overrides: {
      },
      typography: {
        useNextVariants: true,
      }
    });
  }

  render() {
    const theme = this.setTheme();
    return (
      <MuiThemeProvider theme={theme}>
      {isAuthenticated() ? (
        <div>
          <BrowserRouter>
          <Main />
          
          </BrowserRouter>
        </div>
      ) : (
        <Login />
      )}    
      </MuiThemeProvider>
    )    
  }
}

export default App;