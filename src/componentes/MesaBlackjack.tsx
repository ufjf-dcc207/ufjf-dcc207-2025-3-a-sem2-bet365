import { useState, useEffect } from "react";
import "./MesaBlackjack.css"
import Mao from "./Mao";
import Jogador from "./Jogador";
import Controles from "./Controles";
import Saldo from "./Saldo"


interface CartaType {
    naipe: string;
    valor: string;
}

function gerarCarta() {
  const naipes = ['Copas', 'Espadas', 'Ouros', 'Paus'];
  const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const naipe = naipes[Math.floor(Math.random() * naipes.length)];
  const valor = valores[Math.floor(Math.random() * valores.length)];
  return { naipe, valor };
}

function calcularPontuacao(cartas: Array<{ naipe: string; valor: string }>): number {
    let pontuacao = 0;
    let ases = 0;
  
    cartas.forEach(carta => {
      if (carta.valor === 'A') {
        ases += 1;
      } else if (['K', 'Q', 'J'].includes(carta.valor)) {
        pontuacao += 10;
      } else {
        pontuacao += parseInt(carta.valor);
      }
    });
  
    // Tratamento dos Ases
    for (let i = 0; i < ases; i++) {
      if (pontuacao + 11 <= 21) {
        pontuacao += 11;
      } else {
        pontuacao += 1;
      }
    }
  
    return pontuacao;
  }
  

function MesaBlackjack() {

    const [cartasDealer, setCartasDealer] = useState<CartaType[]>([]);
    
    const [cartasJogador, setCartasJogador] = useState<CartaType[]>([]);


    const [saldo, setSaldo] = useState(100);
    const [aposta, setAposta] = useState(10);

    const [jogadorVez, setJogadorVez] = useState(false);
    const [jogoAtivo, setJogoAtivo] = useState(true);
    const [mensagem, setMensagem] = useState('Sua Vez! Aposte e jogue!');

    //verificae vitória/derrota
    useEffect(() =>{
        if (!jogoAtivo || cartasJogador.length === 0) return;
        
        const pontuacaoJogador = calcularPontuacao(cartasJogador);

        if (pontuacaoJogador > 21) {
            setMensagem('Estourou! Você perdeu');
            setSaldo(saldo - aposta);
            setJogoAtivo(false);
            setJogadorVez(false);
        } else if (pontuacaoJogador === 21 && cartasJogador.length === 2) {
            setMensagem('Blackjack! Você ganhou!');
            setSaldo(saldo + aposta * 1.5);
            setJogoAtivo(false);
            setJogadorVez(false);
        }
    }, [cartasJogador]);

    //logica para o dealer jogar
    const jogarDealer = () => {
        let cartasNovasDealer = [...cartasDealer];
        let pontuacaoDealer = calcularPontuacao(cartasNovasDealer);

        while(pontuacaoDealer < 17) {
            const novaCarta = gerarCarta();
            cartasNovasDealer.push(novaCarta);
            pontuacaoDealer = calcularPontuacao(cartasNovasDealer)
        }

        setCartasDealer(cartasNovasDealer);

        const pontuacaoJogador = calcularPontuacao(cartasJogador);

        if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
            setMensagem('Você ganhou!');
            setSaldo(saldo + aposta);
        } else if (pontuacaoDealer > pontuacaoJogador) {
            setMensagem('Dealer ganhou!');
            setSaldo(saldo - aposta);
        } else {
            setMensagem('Empate!');
        }
        
        setJogoAtivo(false);
    };

    const pedirCarta = () => {
        if (!jogoAtivo || !jogadorVez) return;
        
        const novaCarta = gerarCarta();
        setCartasJogador([...cartasJogador, novaCarta]);
    };

    const parar = () => {
        if (!jogoAtivo || !jogadorVez) return;

        setJogadorVez(false);
        jogarDealer();
    };

    const dobrarAposta = () => {
        if (!jogoAtivo || !jogadorVez || saldo < aposta * 2) {
            alert("Saldo insuficiente ou jogada inválida!");
            return;
        }

        setAposta(aposta*2);
        const novaCarta = gerarCarta();
        const novaMao = [...cartasJogador, novaCarta];
        setCartasJogador(novaMao);
        
        const pontuacao = calcularPontuacao(novaMao);
        if (pontuacao <= 21) {
             setJogadorVez(false);
             setTimeout(() => jogarDealer(), 500);
        }
    };

    //mudar este valor depois
    //implementar a lógica correta para adicionar a quantidade de saldo que o jogador quiser
    //MUDADO!
    const adicionarSaldo = () => {
        const valorString = window.prompt("Quanto deseja adicionar ao saldo?");
        
        if (valorString) {
            const valor = parseFloat(valorString);
            if (!isNaN(valor) && valor > 0) {
                setSaldo(saldo + valor);
            } else {
                alert("Valor inválido!");
            }
        }
    };

    const novoJogo = () => {
        if (saldo < aposta){
            alert("Saldo insuficiente para nova aposta!");
            return;
        }

        setCartasDealer([gerarCarta(), gerarCarta()]);
        setCartasJogador([gerarCarta(), gerarCarta()]);
        setAposta(10);
        setJogadorVez(true);
        setJogoAtivo(true);
        setMensagem('Novo Jogo! Sua Vez!');
    };
    
    return (
        <div className="mesa-blackjack">
            <h2>{mensagem}</h2>
            <Saldo valor={saldo} onAdicionarSaldo={adicionarSaldo} aposta={aposta} />

            <div className="area-dealer">
                <Mao cartas={cartasDealer} titulo="Dealer" />
                {cartasDealer.length > 0 && 
                    <div className="pontuacao">Pontuação: {calcularPontuacao(cartasDealer)}</div>
                }
            </div>

           <div className="area-jogador">
                <Jogador nome="Jogador" cartas={cartasJogador} maos={[]} />
                {cartasJogador.length > 0 &&
                    <div className="pontuacao">Pontuação: {calcularPontuacao(cartasJogador)}</div>
                }
            </div>

            <Controles 
                titulo="Controles"
                onPedirCarta={pedirCarta}
                onParar={parar}
                onDobrarAposta={dobrarAposta}
                onNovoJogo={novoJogo}
                jogadorVez={jogadorVez}
                jogoAtivo={jogoAtivo}
                podeDobrar={saldo >= aposta * 2}
                
                maosJogador={[]} 
                setMaosJogador={() => {}} 
            />
        </div>
    )
}

export default MesaBlackjack