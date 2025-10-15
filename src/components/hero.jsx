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
            <h2>Come è nato XimiPvP?</h2>
            </div> 
            <div className="par">
            <p>XimiPvP è nato a marzo 2024 con l’obiettivo di superare tutti i server Practice di Minecraft. Il progetto ha avuto subito grande successo, ma il problema non erano i soldi, bensì il tempo. Dopo una pausa, a giugno 2025 abbiamo deciso di riaprirlo, con più esperienza e la stessa passione di sempre.</p>
           {/*Sostituisci la riga 15 con il testo */}
            </div>
        </section>

        <Card info="Staff Attivo" icon={Shield} />

        <Card info="PVP innovativo" icon={Sword} />
        </div>
        </>
    )
}

export default Hero;
