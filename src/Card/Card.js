import React from "react";

const Card = (props) => {
    const {title, name, age, gender} = props

    return (
        <div className="card-main">
            <h1>Users: Card</h1>
            <div>Name: { name}</div>
            <div>Age: { age}</div>
            <div>Gender: { gender }</div>
        </div>
    )
}

export default Card