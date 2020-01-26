import React, { FC, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import './App.scss';

const App: FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false)

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID as string }).then(() => {
      setIsLogin(liff.isLoggedIn())
    })
  }, [])

  const login = () => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID as string }).then(() => {
      liff.login()
      setIsLogin(liff.isLoggedIn())
    })
  }

  return (
    <div className="App">
      <div className="loginButton">
        <Button variant="contained" color="primary" onClick={() => login()} disabled={isLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default App;