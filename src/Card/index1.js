import React from "react";
import ViewCard from '../Card/Card'
import './styles.css'

const Card = (props) => {
    const {title, name, age, gender} = props

    return (
        <div className="card-main">
            <div className="card">
                <ViewCard/>
            </div>
            <div>asdasd</div>
        </div>
    )
}

export default Card