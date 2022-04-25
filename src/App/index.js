import React from "react";
import { Switch, Route} from 'react-router-dom'
import Home from '../components/home'
import TodoList from '../components/todolist'
import ResponsiveAppBar from "../NavBar";

const App = () => {
    return (
        <div className="app-main">
            <Switch>
                <Route path="/home">
                <ResponsiveAppBar/>
                    <Home/>
                </Route>
                <Route path="/todo-list">
                    <TodoList/>
                </Route>
            </Switch>
        </div>
    )
}

export default App