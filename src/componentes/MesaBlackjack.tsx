import "./MesaBlackjack.css"
import { useState } from "react";
import Mao from "./Mao";
import Jogador from "./Jogador";
import Controles from "./Controles";
import Carta from "./Carta";

function MesaBlackjack() {

    const cartasDealer = [
        {naipe: 'Copas', valor: 'A'},
        {naipe: 'Espadas', valor: '8'}
    ];
    
    const [maosJogador, setMaosJogador] = useState([
        [ //voltar aqui
            {naipe: 'Ouros', valor: '10'},
            {naipe: 'Paus', valor: '7'}
        ]
    ]);

    return (
        <div className="mesa-blackjack">
            <h2>Sua Vez!</h2>
            <Mao cartas={cartasDealer} titulo="Dealer"></Mao>
            <Jogador nome="Jogador" cartas={[]} maos={maosJogador} />

            <Controles titulo="Controles"
                maosJogador={maosJogador}
            />

        </div>
    )
}

export default MesaBlackjack