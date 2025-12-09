import { useState, useEffect } from "react";
import "./MesaBlackjack.css";
import Mao from "./Mao";
import Jogador from "./Jogador";
import Controles from "./Controles";
import Carta, { type CartaPadrao } from "./Carta";
import Saldo from "./Saldo"
import ModalAdicionarSaldo from "./ModalAdicionarSaldo";

type CartaJogo = Omit<CartaPadrao, 'face_para_cima'>;

function gerarCarta() {
  const naipes = ["Copas", "Espadas", "Ouros", "Paus"];
  const valores = [
    "A","2","3","4","5","6","7","8","9","10","J","Q","K",
  ];
  const naipe = naipes[Math.floor(Math.random() * naipes.length)];
  const valor = valores[Math.floor(Math.random() * valores.length)];
  return { naipe, valor };
}

function calcularPontuacao(
  cartas: Array<{ naipe: string; valor: string }>
): number {
  let pontuacao = 0;
  let ases = 0;

  cartas.forEach((carta) => {
    if (carta.valor === "A") {
      ases += 1;
    } else if (["K", "Q", "J"].includes(carta.valor)) {
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

    const [cartasDealer, setCartasDealer] = useState<CartaJogo[]>([]);
    const [maosJogador, setMaosJogador] = useState<CartaJogo[][]>([[]]);
    const [maoAtual, setMaoAtual] = useState(0);
    const [saldo, setSaldo] = useState(0);
    const [aposta, setAposta] = useState(0);
    const [jogadorVez, setJogadorVez] = useState(false);
    const [jogoAtivo, setJogoAtivo] = useState(false);
    const [mensagem, setMensagem] = useState('Sua Vez! Aposte e jogue!');
    const [mostrarModalSaldo, setMostrarModalSaldo] = useState(false);

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

    while (pontuacaoDealer < 17) {
      const novaCarta = gerarCarta();
      cartasNovasDealer.push(novaCarta);
      pontuacaoDealer = calcularPontuacao(cartasNovasDealer);
    }

    setCartasDealer(cartasNovasDealer);

    // Calcula resultado final somando/subtraindo todas as mãos
    let lucroDaRodada = 0;
    let vitorias = 0;
    let derrotas = 0;
    let empates = 0;

    maosJogador.forEach((mao) => {
      const ptsJogador = calcularPontuacao(mao);
      if (ptsJogador > 21) {
        lucroDaRodada -= aposta;
        derrotas++;
      } else {
        if (pontuacaoDealer > 21) {
          lucroDaRodada += aposta;
          vitorias++;
        } else if (ptsJogador > pontuacaoDealer) {
          lucroDaRodada += aposta;
          vitorias++;
        } else if (pontuacaoDealer > ptsJogador) {
          lucroDaRodada -= aposta;
          derrotas++;
        } else {
          empates++;
        }
      }
    });

    setSaldo((prevSaldo) => prevSaldo + lucroDaRodada);

    if (lucroDaRodada > 0) {
      setMensagem(
        `Fim! Lucro Total: R$ ${lucroDaRodada} (V:${vitorias} D:${derrotas} E:${empates})`
      );
    } else if (lucroDaRodada < 0) {
      setMensagem(
        `Fim! Prejuízo Total: R$ ${Math.abs(
          lucroDaRodada
        )} (V:${vitorias} D:${derrotas} E:${empates})`
      );
    } else {
      setMensagem(
        `Tudo empatado! Saldo não mudou. (V:${vitorias} D:${derrotas} E:${empates})`
      );
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
    if (!jogoAtivo || !jogadorVez || saldo < aposta * 2) {
      alert("Saldo insuficiente ou jogada inválida!");
      return;
    }

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

    const abrirModalAdicionarSaldo = () => {
      setMostrarModalSaldo(true);
    };
    
    const adicionarSaldo = (valor: number) => {
      if (valor > 0) {
        setSaldo(saldo + valor);
        setMostrarModalSaldo(false);
        setMensagem(`R$ ${valor} adicionados ao saldo!`);
      }
    };  

  const novoJogo = () => {
    if (saldo <= 0 && saldo < aposta) {
      alert("Saldo insuficiente para nova aposta!");
      return;
    }

    const apostaInput = prompt(`Seu saldo: R$ ${saldo}\nQuanto deseja apostar? (mínimo: 10)`);
    const apostaValor = parseInt(apostaInput || '0');
    
    if (isNaN(apostaValor) || apostaValor < 10 || apostaValor > saldo) {
      alert("Aposta inválida! Mínimo: R$ 10 e não pode exceder seu saldo.");
      return;
    }

    //reseta cartas
    setCartasDealer([]);
    setMaosJogador([[]]);
    setMaoAtual(0);
    setAposta(apostaValor);


    setTimeout(() => {
      setCartasDealer([gerarCarta(), gerarCarta()]);
      setMaosJogador([[gerarCarta(), gerarCarta()]]);

      setJogadorVez(true);
      setJogoAtivo(true);
      setMensagem("Sua Vez! Adicione mãos ou jogue.");
    })

    // setMaoAtual(0);
  };

  const fecharModal = () => {
    setMostrarModalSaldo(false);
  };

  return (
    <div className="layout-geral">
      <div className="cabecalho-app">
        <Saldo
          valor={saldo}
          onAdicionarSaldo={abrirModalAdicionarSaldo}
          aposta={aposta * maosJogador.length}
        />
      </div>

      {mostrarModalSaldo && (
        <ModalAdicionarSaldo
          onConfirmar={adicionarSaldo}
          onCancelar={fecharModal}
        />
      )}

      <div className="mesa-blackjack">
        <div className="cabecalho-mesa">
          <div className="info-jogo">
            <h2>{mensagem}</h2>
            {jogoAtivo && maosJogador.length > 1 && (
              <span style={{ color: "gold" }}>
                Jogando Mão {maoAtual + 1} de {maosJogador.length}
              </span>
            )}
          </div>
        </div>

        <div className="area-dealer">
          <Mao cartas={cartasDealer} titulo="Dealer" />
          {cartasDealer.length > 0 && (
            <div className="pontuacao">
              Pontuação: {calcularPontuacao(cartasDealer)}
            </div>
          )}
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
    </div>
    );
}

export default MesaBlackjack
