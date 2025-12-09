import "./Saldo.css"

interface saldoProps {
    valor: number;
    aposta: number;
    onAdicionarSaldo: () => void;
}

function Saldo({ valor, aposta, onAdicionarSaldo }: saldoProps) {
    return (
        <div className="saldo-container">
            <div className="saldo-info">
                <h3>Saldo: R$ {valor}</h3>
                {aposta > 0 && <h4>Aposta Total: R$ {aposta}</h4>}
                {/* <h3>Aposta: R$ {aposta}</h3> */}
            </div>
            <button 
                className="botao-saldo" 
                onClick={onAdicionarSaldo}
                title="Clique para adicionar saldo"
            >
                <span className="icone-adicionar">+</span>
                Adicionar Saldo
            </button>
        </div>
    );
}
export default Saldo;