import Mao from "./Mao";

interface JogadorProps {
  nome: string;
  cartas: Array<{ naipe: string; valor: string }>;
  maos: Array<Array<{ naipe: string; valor: string }>>;
}

export default function Jogador({ nome, cartas, maos }: JogadorProps) {
  return (
    <div className="jogador">
        {maos.map((mao, index) => (
          <Mao cartas={mao} titulo={`Mão ${index + 1}`} />
        ))}
    </div>
  );
}
