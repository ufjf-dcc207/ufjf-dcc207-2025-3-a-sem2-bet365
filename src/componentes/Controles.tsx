import "./Controles.css"
import MesaBlackjack from "./MesaBlackjack";



interface ControlesProps {
    titulo: string;
    onPedirCarta: () => void;
    onParar: () => void;
    onDobrarAposta: () => void;
    onNovoJogo: () => void;
    onAdicionarMao: () => void;

    jogadorVez: boolean;
    jogoAtivo: boolean;
    podeDobrar: boolean;
    podeAdicionarMao: boolean;

    // maosJogador: { naipe: string; valor: string; }[][];
    // setMaosJogador: (maos: { naipe: string; valor: string; }[][]) => void;
}

const Controles = ({ 
    titulo, //maosJogador, setMaosJogador,
    onPedirCarta,
    onParar,
    onDobrarAposta,
    onNovoJogo,
    onAdicionarMao,
    jogadorVez,
    jogoAtivo,
    podeDobrar,
    podeAdicionarMao
}: ControlesProps) => {

    // const addMao = () => {
    //     if (maosJogador.length < 4) {
    //         const novaMao = [
    //             {naipe: 'Copas', valor: '5'},
    //             {naipe: 'Espadas', valor: '6'}
    //         ];
    //         setMaosJogador(maosJogador.concat([novaMao]));
    //     } else{
    //         alert("Limite máximo de 4 mãos atingido!");
    //     }
            
    // }



    return (
        <div className="controles">
            <h3>{titulo}</h3>
            <div className="botoes-controle">
                <button 
                    className="botaocontrole"
                    onClick={onPedirCarta}
                    disabled={!jogadorVez || !jogoAtivo}
                >
                    Pedir Carta
                </button>
                <button
                    className="botaocontrole"
                    onClick={onParar}
                    disabled={!jogadorVez || !jogoAtivo}
                >
                    Parar
                </button>
                <button
                    className="botaocontrole"
                    onClick={onDobrarAposta}
                    disabled={!jogadorVez || !jogoAtivo || !podeDobrar}
                >
                    Dobrar Aposta
                </button>
                <button 
                    className="botaocontrole novo-jogo"
                    onClick={onNovoJogo}
                >
                    Novo Jogo
                </button>
            </div>
            <div className="addmao">
                <button 
                    className="botaocontrole" 
                    onClick={onAdicionarMao}
                    disabled={!podeAdicionarMao}
                >
                    Adicionar Mão
                </button>
            </div>
        </div>
    );
}

export default Controles;
