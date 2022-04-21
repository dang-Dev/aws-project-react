import React, { useState } from "react";

import Card from '../Card/Card'

import './Styles.css'
// import DeleteIcon from '@mui/icons-material/Delete';

const App = () => {
    const [count, setCount] = useState(0)

    const [user, setUser] = useState('')

    const handleIncrement = () => {
        setCount(count + 1)
    }

    const handleOnChange = (e) => {
        setUser(e.target.value)
    }

    return (
        <>
        <div>
            {/* <span><DeleteIcon/></span> */}
            Count: {count}
        </div>
        <button onClick={handleIncrement}>Increment</button>
        <hr></hr>
        <input name="user" onChange={handleOnChange} value={user}/>
        <hr></hr>
        
        <div className="app-main">
            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ian" age={22} gender="Male"/>
            <Card name="Boss T" age={12} gender="Male"/>
            <Card name="Jerry" age={28} gender="Male"/>
        </div>
        </>
    )
}

export default App