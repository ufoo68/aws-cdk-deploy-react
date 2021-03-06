import React, { FC, useState, useEffect } from 'react'
import { Profile } from '@line/bot-sdk'
import './App.scss'

const App: FC = () => {
  const [profile, setProfile] = useState<Profile>({
    displayName: '',
    userId: '',
    pictureUrl: '',
    statusMessage: '',
  })

  useEffect(() => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID! }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login()
      }
      liff.getProfile()
        .then(profile => {
          setProfile(profile)
        })
        .catch((err) => {
          console.log('error', err)
        })
    })
  }, [])

  return (
    <div className="App">
      <div className="name">
        {profile.displayName}
      </div>
      <img src={profile.pictureUrl} className="picture"/>
      <div className="status">
        {profile.statusMessage}
      </div>
      <div className="userid">
        {profile.userId}
      </div>
    </div>
  );
}

export default App;