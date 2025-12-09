import Carta from "./Carta";
import "./Mao.css"

interface MaoPadrao {
    cartas: Array<{naipe: string; valor: string}>;
    titulo: string;
    atual?: boolean;
}

function calcularPontuacao(cartas: Array<{naipe: string; valor: string}>): number {
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
  
    for (let i = 0; i < ases; i++) {
        if (pontuacao + 11 <= 21) {
            pontuacao += 11;
        } else {
            pontuacao += 1;
        }
    }
  
    return pontuacao;
}
  
  

export default function Mao({cartas, titulo}: MaoPadrao) {
    return (
        <div className="mao">
            <div className="mao-header">
                <h3>{titulo}</h3>
                <span className="contador-cartas">{cartas.length} cartas</span>
            </div>
            <div className="cartas-container">
                {cartas.map((carta, posicao) => (
                    <Carta
                        key = {posicao}
                        naipe={carta.naipe}
                        valor={carta.valor}
                    />
                ))}
            </div>
        </div>
    );
}