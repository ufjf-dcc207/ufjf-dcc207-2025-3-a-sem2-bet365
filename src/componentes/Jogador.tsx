import Mao from "./Mao";

interface JogadorProps {
  nome: string;
  cartas: Array<{ naipe: string; valor: string }>;
}

export default function Jogador({ nome, cartas }: JogadorProps) {
  return (
    <div className="jogador">
      <Mao cartas={cartas} titulo={`${nome}`} />
    </div>
  );
}
