import Mao from "./Mao";

interface JogadorProps {
  nome: string;
  cartas: Array<{ naipe: string; valor: string }>;
  maos: Array<Array<{ naipe: string; valor: string }>>;
}

export default function Jogador({ nome, cartas, maos }: JogadorProps) {
  return (
    <div className="jogador">
      <div style={{display: "flex", flexDirection: "row", gap: "20px", justifyContent: "center", flexWrap: "wrap"}}>
        {maos.map((mao, index) => (
          <Mao key={index} cartas={mao} titulo={`Mão ${index + 1}`} />
        ))}
      </div>
      <Mao cartas={cartas} titulo="Mão do Jogador" />
    </div>
  );
}
