import Carta, { type CartaPadrao } from "./Carta";
import "./Mao.css"

type CartaJogo = Omit<CartaPadrao, 'face_para_cima'>;

interface MaoPadrao {
    //cartas: Array<{naipe: string; valor: string}>;
    cartas: CartaJogo[];
    titulo: string;
    atual?: boolean;
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