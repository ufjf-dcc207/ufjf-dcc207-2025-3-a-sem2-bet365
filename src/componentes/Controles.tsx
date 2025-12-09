import "./Controles.css"

interface ControlesProps {
    titulo: string;
    onPedirCarta: () => void;
    onParar: () => void;
    onDobrarAposta: () => void;
    onNovoJogo: () => void;
    jogadorVez: boolean;
    jogoAtivo: boolean;
    podeDobrar: boolean;
}

const Controles = ({ 
    titulo,
    onPedirCarta,
    onParar,
    onDobrarAposta,
    onNovoJogo,
    jogadorVez,
    jogoAtivo,
    podeDobrar
}: ControlesProps) => {
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
        </div>
    );
}

export default Controles;