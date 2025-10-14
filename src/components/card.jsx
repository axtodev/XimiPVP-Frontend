import React from 'react';
import '../style/card.css';

function Card({info, icon: Icon}){
    return(
        <>
        <div className="card">
            <Icon size={64} color="orange" className='icon'/>
            <p>{info}</p>
            </div>  
        </>
    )
}

export default Card;