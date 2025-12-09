import "./Carta.css"

export interface CartaPadrao {
    naipe: string;
    valor: string; // As, rei, rainha, valete e números
    face_para_cima?: boolean;
}

function getvalorDaCarta(valor: string): number {
    if (valor === 'A') {
        return 11; //pode ser 1 ou 11
    }
    if (['K', 'Q', 'J'].includes(valor)) {
        return 10;
    }
    return parseInt(valor);
}

function Carta({naipe, valor, face_para_cima = true}: CartaPadrao) {
    if (!face_para_cima)
        return <div className="carta para-baixo">verso da carta</div>;

    const valorNumerico = getvalorDaCarta(valor);
    const cor = (naipe === 'Copas' || naipe === 'Ouros') ? 'vermelho' : 'preto';
    
    return (
        <div className={`carta carta-${naipe} ${cor}`}>
            <div className="valor-carta valor-superior">{valor}</div>
            <div className="naipe-carta">
                {naipe === 'Paus' && '♣'}
                {naipe === 'Espadas' && '♠'}
                {naipe === 'Ouros' && '♦'}
                {naipe === 'Copas' && '♥'}
            </div>
            <div className="valor-carta valor-inferior">{valor}</div>
        </div>
    )
}

export default Carta;