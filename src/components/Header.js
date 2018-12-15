import React from 'react'
import logo from '../logo.svg'
const Header = () => {
    return (
        <div className="header-comp mb-3">
            <img src={logo} className="App-logo" alt="logo" />
            <h3>Music Plyer</h3>
        </div>
    )
}
export default Header