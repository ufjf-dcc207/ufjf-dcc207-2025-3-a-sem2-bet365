import Mao from "./Mao";
import Carta from "./Carta";
import "./Jogador.css"


interface JogadorProps {
  nome: string;
  cartas: Array<{ naipe: string; valor: string }>;
  maos: Array<Array<{ naipe: string; valor: string }>>;
  maoAtual?: number;
}

export default function Jogador({ nome, cartas, maos, maoAtual }: JogadorProps) {
  return (
    <div className="jogador">
      <div className="maos">
        {maos.map((mao, id) => (
          <div 
            key={id}
            className="cartas">
            {mao.map((carta, posicao) => (
              <Carta
                key={posicao}
                naipe={carta.naipe}
                valor={carta.valor}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
