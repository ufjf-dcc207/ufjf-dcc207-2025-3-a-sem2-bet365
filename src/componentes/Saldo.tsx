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
                <h3>Aposta: R$ {aposta}</h3>
            </div>
            <button className="botao-saldo" onClick={onAdicionarSaldo}>Adicionar Saldo</button>
        </div>
    );
}
export default Saldo;