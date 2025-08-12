import React from 'react';
import "../style/hero.css";
import Card from './card';
import {Shield, Sword} from 'lucide-react';

function Hero(){
    return(
        <>
        <div className="content-wrapper">
        <section>
            <div className="title">
            <h2>Chi siamo?</h2>
            </div> 
            <div className="par">
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
        </section>

        <Card info="Staff Attivo" icon={Shield} />

        <Card info="PVP innovativo" icon={Sword} />
        </div>
        </>
    )
}

export default Hero;