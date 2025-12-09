import { useState } from "react";
import "./ModalAdicionarSaldo.css";

interface ModalAdicionarSaldoProps {
  onConfirmar: (valor: number) => void;
  onCancelar: () => void;
}

function ModalAdicionarSaldo({ onConfirmar, onCancelar }: ModalAdicionarSaldoProps) {
  const [valor, setValor] = useState(100);
  const [erro, setErro] = useState("");

  const handleConfirmar = () => {
    if (valor < 10) {
      setErro("Mínimo de R$ 10");
      return;
    }
    if (valor > 10000) {
      setErro("Máximo de R$ 10.000");
      return;
    }
    onConfirmar(valor);
  };

  const valoresPredefinidos = [50, 100, 200, 500, 1000];

  return (
    <div className="modal-overlay">
      <div className="modal-adicionar-saldo">
        <h3>Adicionar Saldo</h3>
        
        <div className="valores-rapidos">
          <p>Valores rápidos:</p>
          <div className="botoes-rapidos">
            {valoresPredefinidos.map((v) => (
              <button
                key={v}
                className="botao-rapido"
                onClick={() => setValor(v)}
              >
                R$ {v}
              </button>
            ))}
          </div>
        </div>

        <div className="input-personalizado">
          <label htmlFor="valor">Ou digite um valor:</label>
          <div className="input-com-simbolo">
            <span className="simbolo-moeda">R$</span>
            <input
              type="number"
              id="valor"
              min="10"
              max="10000"
              step="10"
              value={valor}
              onChange={(e) => {
                setValor(Number(e.target.value));
                setErro("");
              }}
            />
          </div>
          {erro && <div className="erro">{erro}</div>}
        </div>

        <div className="modal-botoes">
          <button className="botao-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="botao-confirmar" onClick={handleConfirmar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAdicionarSaldo;