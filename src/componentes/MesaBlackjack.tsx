import "./MesaBlackjack.css"
import Mao from "./Mao";
import Jogador from "./Jogador";
import Controles from "./Controles";
import Carta from "./Carta";

function gerarCarta() {
  const naipes = ['Copas', 'Espadas', 'Ouros', 'Paus'];
  const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const naipe = naipes[Math.floor(Math.random() * naipes.length)];
  const valor = valores[Math.floor(Math.random() * valores.length)];
  return { naipe, valor };
}


function MesaBlackjack() {

    const cartasDealer = [
        {naipe: 'Copas', valor: 'A'},
        {naipe: 'Espadas', valor: '8'}
    ];
    
    const cartasJogador = [
        {naipe: 'Ouros', valor: '10'},
        {naipe: 'Paus', valor: '7'}
    ]
    return (
        <div className="mesa-blackjack">
            <h2>Sua Vez!</h2>
            <Mao cartas={cartasDealer} titulo="Dealer"></Mao>
            <Jogador nome="Jogador" cartas={cartasJogador} />

            <Controles titulo="Controles"/>

        </div>
    )
}

export default MesaBlackjack