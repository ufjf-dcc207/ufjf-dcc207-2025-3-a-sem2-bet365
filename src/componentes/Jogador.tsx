import Mao from "./Mao";
import Carta, { type CartaPadrao } from "./Carta";
import "./Jogador.css"

type CartaJogo = Omit<CartaPadrao, 'face_para_cima'>;

interface JogadorProps {
  nome: string;
  // cartas: Array<{ naipe: string; valor: string }>;
  cartas: CartaJogo[];
  // maos: Array<Array<{ naipe: string; valor: string }>>;
  maos: CartaJogo[][];
  maoAtual?: number;
}

export default function Jogador({ nome, cartas, maos, maoAtual }: JogadorProps) {
  // Se maos estiver vazio, usa cartas como uma única mão
  const maosParaMostrar = maos.length > 0 ? maos : [cartas];

  return (
    <div className="jogador">
      <div className="maos">
        <h3>{nome}</h3>
        <div className="lista">
        {maosParaMostrar.map((mao, id) => (
          <div 
            key={id}
            className={`CartasMao ${id === maoAtual ? 'CartasMaoAtual' : ''}`} >
            {mao.map((carta, posicao) => (
              <Carta
                key={posicao}
                naipe={carta.naipe}
                valor={carta.valor}
                face_para_cima={true}
              />
            ))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
