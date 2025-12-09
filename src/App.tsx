import { useState } from 'react'
import './App.css'
import MesaBlackjack from './componentes/MesaBlackjack'
import Saldo from './componentes/Saldo'

function App() {
  const [saldo, setSaldo] = useState(100)

  const adicionarSaldo = () => {
    setSaldo(saldo + 50)
  }

  const atualizarSaldo = (novoSaldo: number) => {
    setSaldo(novoSaldo)
  }


  return (
    <div className='App'>
      <h1>♠️ Bem-vindo ao jogo de 21 ♣️</h1>
      <MesaBlackjack />
    </div>
  )
}

export default App
