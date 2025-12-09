import "./Controles.css"
import MesaBlackjack from "./MesaBlackjack";


interface ControlesProps {
    titulo: string;
    maosJogador: { naipe: string; valor: string; }[][];
    setMaosJogador: (maos: { naipe: string; valor: string; }[][]) => void;
}

const Controles = ({ titulo, maosJogador, setMaosJogador }: ControlesProps) => {

    const addMao = () => {
        if (maosJogador.length < 4) {
            const novaMao = [
                {naipe: 'Copas', valor: '5'},
                {naipe: 'Espadas', valor: '6'}
            ];
            setMaosJogador(maosJogador.concat([novaMao]));
        } else{
            alert("Limite máximo de 4 mãos atingido!");
        }
            
    }



    return (
        <div className="controles">
            <h3>{titulo}</h3>
            <div className="cartas">
                <button className="botaocontrole">Pedir Carta</button>
                <button className="botaocontrole">Parar</button>
                <button className="botaocontrole">Dobrar Aposta</button>
            </div>
            <div className="addmao">
                <button className="botaocontrole" onClick={addMao}>Adicionar Mão</button>
            </div>
        </div>
    );
}

export default Controles;
