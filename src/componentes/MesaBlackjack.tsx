import { useState, useEffect } from "react";
import "./MesaBlackjack.css"
import Mao from "./Mao";
import Jogador from "./Jogador";
import Controles from "./Controles";
import Carta, { type CartaPadrao } from "./Carta";
import Saldo from "./Saldo"

type CartaJogo = Omit<CartaPadrao, 'face_para_cima'>;

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

    const [cartasDealer, setCartasDealer] = useState<CartaJogo[]>([
        {naipe: 'Copas', valor: 'A'},
        {naipe: 'Espadas', valor: '8'}
    ]);
    
    //const [cartasJogador, setCartasJogador] = useState([
    const [maosJogador, setMaosJogador] = useState<CartaJogo[][]>([
        [
            {naipe: 'Ouros', valor: '10'},
            {naipe: 'Paus', valor: '7'}
        ]
    ]);


    const [maoAtual, setMaoAtual] = useState(0);
    const [saldo, setSaldo] = useState(100);
    const [aposta, setAposta] = useState(10);
    const [jogadorVez, setJogadorVez] = useState(true);
    const [jogoAtivo, setJogoAtivo] = useState(true);
    const [mensagem, setMensagem] = useState('Sua Vez! Aposte e jogue!');

    // Obter a mão atual do jogador
    const cartasJogadorAtual: CartaJogo[] = maosJogador[maoAtual];

    //verificae vitória/derrota
    useEffect(() =>{
        if (!jogoAtivo) return;
        
        const pontuacaoJogador = calcularPontuacao(cartasJogadorAtual);
        const pontuacaoDealer = calcularPontuacao(cartasDealer);

        if (pontuacaoJogador > 21) {
            // caso estoure passa pra proxima mao (se tiver)
            if (maoAtual < maosJogador.length -1) {
                setMaoAtual(maoAtual+1);
                setMensagem('Estourou na mão ${maoAtual + 1}. Você perdeu');
            } else {
                setMensagem('Estourou! Você perdeu');
                setSaldo(saldo - aposta * maosJogador.length);
                setJogoAtivo(false);
            }
        } else if (pontuacaoJogador === 21) {
            // se fez 21 passa pra proxima mao (se tiver)
            setMensagem('Blackjack! Você ganhou!');
            setSaldo(saldo + aposta * 1.5 * maosJogador.length);
            setJogoAtivo(false);
        }
    }, [cartasJogadorAtual, jogoAtivo, maoAtual, maosJogador, aposta, saldo, cartasDealer]);

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

        let resultadoFinal = 0;
        maosJogador.forEach(mao => {
            const pontuacaoJogador = calcularPontuacao(mao);

            if (pontuacaoJogador > 21) {
                resultadoFinal -= aposta;
            } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
                resultadoFinal += aposta;
            } else if (pontuacaoDealer > pontuacaoJogador) {
                resultadoFinal -= aposta;
            }
        });

        if (resultadoFinal > 0) {
            setMensagem('Você ganhou!');
            setSaldo(saldo + resultadoFinal);
        } else if (resultadoFinal < 0) {
            setMensagem('Dealer ganhou!');
            setSaldo(saldo + resultadoFinal); // resultadoFinal já é negativo
        } else {
            setMensagem('Empate!');
        }
        setJogoAtivo(false);
    };

    const pedirCarta = () => {
        if (!jogoAtivo || !jogadorVez) return;
        
        const novaCarta = gerarCarta();
        const novasMaos = [...maosJogador];
        novasMaos[maoAtual] = [...novasMaos[maoAtual], novaCarta];
        setMaosJogador(novasMaos);
    };

    const parar = () => {
        if (!jogoAtivo || !jogadorVez) return;

        if (maoAtual < maosJogador.length - 1) {
            setMaoAtual(maoAtual + 1);
            setMensagem(`Mão ${maoAtual + 1} terminada. Próxima mão!`);
        } else {
            setJogadorVez(false);
            jogarDealer();
        }
    };

    const dobrarAposta = () => {
        if (!jogoAtivo || !jogadorVez || saldo < aposta * 2) return;

        const novasMaos = [...maosJogador];
        
        const novaCarta = gerarCarta();
        novasMaos[maoAtual] = [...novasMaos[maoAtual], novaCarta];

        setAposta(aposta*2);
        setMaosJogador(novasMaos);

        const pontuacaoAtual = calcularPontuacao(novasMaos[maoAtual]);

        if (maoAtual < maosJogador.length - 1) {
            setMaoAtual(maoAtual + 1);
        } else {
            setJogadorVez(false);
            if (pontuacaoAtual <= 21) {
              setTimeout(() => jogarDealer(), 500);
            }
        }

    };

    const adicionarMao = () => {
        if (maosJogador.length < 4 && jogoAtivo && jogadorVez) {
            const novaMao = [gerarCarta(), gerarCarta()];
            setMaosJogador([...maosJogador, novaMao]);
        } else if (maosJogador.length >= 4) {
            alert("Limite máximo de 4 mãos atingido!");
        }
    };

    const novoJogo = () => {
        setCartasDealer([gerarCarta(), gerarCarta()]);
        setMaosJogador([[gerarCarta(), gerarCarta()]]);
        setMaoAtual(0);
        setAposta(10);
        setJogadorVez(true);
        setJogoAtivo(true);
        setMensagem('Novo Jogo! Sua Vez!');
    };
    
    return (
        <div className="mesa-blackjack">
            <h2>{mensagem}</h2>
            {maosJogador.length > 1 && (
                <div className="contador-maos">
                    Mão {maoAtual + 1} de {maosJogador.length}
                </div>
            )}

            <div className="area-dealer">
                <Mao cartas={cartasDealer} titulo="Dealer" />
                <div className="pontuacao">Pontuação: {calcularPontuacao(cartasDealer)}</div>
            </div>

            <div className="area-jogador">
                <Jogador 
                    nome="Jogador" 
                    cartas={cartasJogadorAtual}
                    maos={maosJogador} 
                    maoAtual={maoAtual} 
                />
                <div className="pontuacao">
                    Pontuação (Mão {maoAtual+1}): {calcularPontuacao(cartasJogadorAtual)}
                </div>
            </div>

            <Controles 
                titulo="Controles"
                onPedirCarta={pedirCarta}
                onParar={parar}
                onDobrarAposta={dobrarAposta}
                onNovoJogo={novoJogo}
                onAdicionarMao={adicionarMao}
                jogadorVez={jogadorVez}
                jogoAtivo={jogoAtivo}
                podeDobrar={saldo >= aposta * 2}
                podeAdicionarMao={maosJogador.length < 4 && jogoAtivo && jogadorVez}           
            />
        </div>
    );
}

export default MesaBlackjack
