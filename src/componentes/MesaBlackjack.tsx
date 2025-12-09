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

    const [maosJogador, setMaosJogador] = useState<CartaType[][]>([[]]);
    const [maoAtual, setMaoAtual] = useState(0);


    const [saldo, setSaldo] = useState(100);
    const [aposta, setAposta] = useState(10);

    const [jogadorVez, setJogadorVez] = useState(false);
    const [jogoAtivo, setJogoAtivo] = useState(true);
    const [mensagem, setMensagem] = useState('Sua Vez! Aposte e jogue!');

    // Helper para pegar as cartas da mão que está jogando agora
    const cartasMaoAtual = maosJogador[maoAtual] || [];

    //verificae vitória/derrota
    useEffect(() =>{
        if (!jogoAtivo || cartasMaoAtual.length === 0) return;
        
        const pontuacao = calcularPontuacao(cartasMaoAtual);

        if (pontuacao >= 21) {
            
            if (maoAtual < maosJogador.length - 1) {
                const motivo = pontuacao > 21 ? "Estourou!" : "21!";
                setMensagem(`${motivo} Indo para mão ${maoAtual + 2}...`);
                
                const timer = setTimeout(() => {
                    setMaoAtual(maoAtual + 1);
                }, 1500);
                return () => clearTimeout(timer);

            } else {
                const motivo = pontuacao > 21 ? "Estourou!" : "21!";
                setMensagem(`${motivo} Vez do Dealer...`);
                setJogadorVez(false);
                
                const timer = setTimeout(() => {
                    jogarDealer();
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [cartasMaoAtual]);

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

        // Calcula resultado final somando/subtraindo todas as mãos
        let lucroTotal = 0;

        
        maosJogador.forEach((mao) => {
        const ptsJogador = calcularPontuacao(mao);
            if (ptsJogador > 21) {
                lucroTotal -= aposta;
            } else if (pontuacaoDealer > 21 || ptsJogador > pontuacaoDealer) {
                lucroTotal += aposta; 
            } else if (pontuacaoDealer > ptsJogador) {
                lucroTotal -= aposta; 
            }
        });

        if (lucroTotal > 0) setMensagem(`Fim! Você ganhou R$ ${lucroTotal}`);
        else if (lucroTotal < 0) setMensagem(`Fim! Você perdeu R$ ${Math.abs(lucroTotal)}`);
        else setMensagem('Fim! Tudo empatado.');

        setSaldo(prev => prev + lucroTotal);
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
            setMensagem(`Parou na mão ${maoAtual + 1}. Jogando mão ${maoAtual + 2}...`);
        } else {
            setJogadorVez(false);
            jogarDealer();
        }
    };

    const dobrarAposta = () => {
        if (!jogoAtivo || !jogadorVez || saldo < aposta * 2) {
            alert("Saldo insuficiente ou jogada inválida!");
            return;
        }
        
        const novaCarta = gerarCarta();
        const novasMaos = [...maosJogador];
        novasMaos[maoAtual] = [...novasMaos[maoAtual], novaCarta];
        setMaosJogador(novasMaos);

        if (maoAtual < maosJogador.length - 1) {
            setMaoAtual(maoAtual + 1);
        } else {
            setJogadorVez(false);
            setTimeout(jogarDealer, 500);
        }
    };

    const adicionarMao = () => {
        if (saldo >= aposta) { 
            const novaMao = [gerarCarta(), gerarCarta()];
            setMaosJogador([...maosJogador, novaMao]);
            alert("Nova mão adicionada! (+ R$ 10 de aposta na mesa)");
        } else {
            alert("Saldo insuficiente para abrir nova mão!");
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
        setMaosJogador([[gerarCarta(), gerarCarta()]]);
        setMaoAtual(0);
        setAposta(10);
        setJogadorVez(true);
        setJogoAtivo(true);
        setMensagem('Sua Vez! Adicione mãos ou jogue.');
    };
    
    return (
        <div className="mesa-blackjack">
            <div className="cabecalho-mesa">
                <div className="info-jogo">
                    <h2>{mensagem}</h2>
                    {jogoAtivo && maosJogador.length > 1 && 
                        <span style={{color: 'gold'}}>Jogando Mão {maoAtual + 1} de {maosJogador.length}</span>
                    }
                </div>
                <Saldo valor={saldo} onAdicionarSaldo={adicionarSaldo} aposta={aposta * maosJogador.length} />
            </div>

            <div className="area-dealer">
                <Mao cartas={cartasDealer} titulo="Dealer" />
                {cartasDealer.length > 0 && 
                    <div className="pontuacao">Pontuação: {calcularPontuacao(cartasDealer)}</div>
                }
            </div>

           <div className="area-jogador">
                {/* Agora passamos TODAS as mãos para o Jogador */}
                <Jogador 
                    nome="Jogador" 
                    cartas={cartasMaoAtual} // fallback para compatibilidade
                    maos={maosJogador} 
                    maoAtual={maoAtual} 
                />
                <div className="pontuacao">
                    Pontuação Atual: {calcularPontuacao(cartasMaoAtual)}
                </div>
            </div>

            <Controles 
                titulo="Controles"
                onPedirCarta={pedirCarta}
                onParar={parar}
                onDobrarAposta={dobrarAposta}
                onNovoJogo={novoJogo}
                onAdicionarMao={adicionarMao} // Passamos a função nova
                
                jogadorVez={jogadorVez}
                jogoAtivo={jogoAtivo}
                podeDobrar={saldo >= aposta * 2}
                podeAdicionarMao={jogoAtivo && jogadorVez && maosJogador.length < 4}
            />
        </div>
    )
}

export default MesaBlackjack