import React, { useState } from "react";
import "./App.css";

const MenorNatural = (a, b) => {
    if(a < 0){
        return b;
    }
    if(b < 0){
        return a;
    }

    if(a < b){
        return a;
    } else {
        return b;
    }
}

const DetectaOperacao=(d)=>{
    if(d === "+" || d === "/" || d === "*" || d === "-" || d === "%") {
        return true;
    }
    else {
        return false;
    }
}


const DetectaUltimo=(valorTela)=>{
    if (valorTela === "") {
        return 1;
    }
    if (DetectaOperacao(valorTela.substring(valorTela.length - 1, valorTela.length))) {
        return 2; 
    }
    if (valorTela.substring(valorTela.length - 1, valorTela.length) === "(") {
        return 3;          
    }
    if (valorTela.substring(valorTela.length - 1, valorTela.length) === ".") {
        return 4;          
    }
}

const EfetuaPorcentagem = (vtela) => {
    while (vtela.indexOf("%") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("%")) + "/100*" + vtela.substring(vtela.indexOf("%") +1, vtela.length);
    }
    return vtela;
}

const RemoveZeroEsquerda = (vtela) => {
    if (vtela.indexOf("0") === 0) {
        vtela = vtela.substring(1, vtela.length);
    }
    while(vtela.indexOf("+0") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("+0") +1) + vtela.substring(vtela.indexOf("+0") +2, vtela.length); 
    }
    while(vtela.indexOf("-0") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("-0") +1) + vtela.substring(vtela.indexOf("-0") +2, vtela.length); 
    }
    while(vtela.indexOf("/0") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("/0") +1) + vtela.substring(vtela.indexOf("/0") +2, vtela.length); 
    }
    while(vtela.indexOf("*0") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("*0") +1) + vtela.substring(vtela.indexOf("*0") +2, vtela.length); 
    }
    while(vtela.indexOf("(0") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("(0") +1) + vtela.substring(vtela.indexOf("(0") +2, vtela.length); 
    }
    return vtela;
}

const TratamentoParenteses=(vtela) => {
    if(vtela.indexOf("(") === -1) {
        return vtela;
    }
    for(let i = 0; i <= 9; i++) {
        while(vtela.indexOf(i.toString()+"(") !== -1) {
            vtela = vtela.substring(0, vtela.indexOf(i.toString()+"(") +1) + "*" + vtela.substring(vtela.indexOf(i.toString()+"(")+1, vtela.length);
        }
        while(vtela.indexOf(")"+i.toString()) !== -1) {
            vtela = vtela.substring(0, vtela.indexOf(")"+i.toString()) +1) + "*" + vtela.substring(vtela.indexOf(")"+i.toString())+1, vtela.length);
        }
    }
    if (DetectaUltimo(vtela) === 3) {
        vtela = vtela.substring(0, vtela.length -1);
    }
    let numAbre = 0;
    let numFecha = 0;
    vtela.split("").map((letra)=>{
        if(letra==="("){numAbre++}
        if(letra===")"){numFecha++}
    })
    while (numAbre > numFecha) {
        vtela = vtela + ")";
        numFecha++;
    }
    return vtela;
}

const TratamentoUltimoDigito=(vtela) => {
    switch (DetectaUltimo(vtela)) {
        case 1:
        break;
        case 2:
            vtela = vtela.substring(0, vtela.length - 1);
        break;
        case 3:
            vtela = vtela.substring(0, vtela.length - 1);
        break;
        case 4:
            vtela = vtela.substring(0, vtela.length - 1);
        break;
    }
    return vtela;
}

export default function App() {
    const [valorTela, setValorTela] = useState("");
    const [resultado, setResultado] = useState(0);
    const [operacao, setOperacao] = useState(false);

    const Tela=(val, res)=>{
        return(
            <div className="tela">
                <span>
                    <p className="valorTela">{val}</p>
                    <p className="resultado">{res}</p>
                </span>
            </div>
        )
    }

    const Button=(label, onClick)=>{
        return(
            <button className="btn" onClick={onClick}>{label}</button>
        );
    }

    const addDigitoTela=(d) => {
        if (d === ".") {
            let valorTelaInvertido = valorTela.split("").reverse().join("");
            let ultimaSoma = valorTelaInvertido.indexOf("+");
            let ultimaSub = valorTelaInvertido.indexOf("-");
            let ultimaMult = valorTelaInvertido.indexOf("*");
            let ultimaDiv = valorTelaInvertido.indexOf("/");
            let ultimaPorCem = valorTelaInvertido.indexOf("%");

            let ultimafunc = MenorNatural(valorTela.length, ultimaSoma);
            ultimafunc = MenorNatural(ultimafunc, ultimaSub);
            ultimafunc = MenorNatural(ultimafunc, ultimaMult);
            ultimafunc = MenorNatural(ultimafunc, ultimaDiv);
            ultimafunc = MenorNatural(ultimafunc, ultimaPorCem);

            if (valorTelaInvertido.substring(0, ultimafunc).indexOf(".") !== -1) {
                return;
            }
        }

        if (DetectaOperacao(d)) {
            switch (DetectaUltimo(valorTela)) {
                case 1:
                break;
                case 2:
                    let vtela=valorTela;
                    vtela=vtela.substring(0,(vtela.length-1))
                    if(DetectaUltimo(vtela) === 3) {
                        if(d === "/" || d === "*" || d === "%") {
                            break;
                        }
                        setValorTela(valorTela + d);
                    }
                    setValorTela(vtela + d);
                break; 
                case 3:
                    if(d === "/" || d === "*" || d === "%") {
                        break;
                    }
                    setValorTela(valorTela + d);
                break;
                case 4:
                break;
                default:
                    if (operacao) {
                        setOperacao(false);
                        setValorTela(resultado + d);
                        break;   
                    } 
                    setValorTela(valorTela + d);
                break;
            }
        } else {
            if (operacao) {
                setValorTela(d);
                setOperacao(false);
                return;
            }
            setValorTela(valorTela + d);
        }
    }

    const addParenteses=()=>{
        switch (DetectaUltimo(valorTela)) {
            case 1:
                setValorTela(valorTela + "(");
            break;
            case 2:
                setValorTela(valorTela + "(");
            break; 
            case 3:
                setValorTela(valorTela + "(");
            break;
            case 4:
            break;
            default:
                if(operacao) {
                    setValorTela("(" + valorTela);
                    break;
                }
                let numAbre = 0;
                let numFecha = 0;
                valorTela.split("").map((letra)=>{
                    if(letra==="("){numAbre++}
                    if(letra===")"){numFecha++}
                })
                if(numAbre>numFecha) {
                    setValorTela(valorTela + ")");
                    break;
                } else {
                    setValorTela(valorTela + "(");
                }
            break;
        }
    }

    const limparMemoria=()=>{
        setOperacao(false);
        setValorTela('');
        setResultado(0);
        return;
    }

    const Operacao=(oper)=>{
        if (oper==='bs') {
            let vtela = valorTela;
            vtela = vtela.substring(0, vtela.length - 1);
            setValorTela(vtela);
            setOperacao(false);
            return;
        }
        try{
            let vtela = EfetuaPorcentagem(valorTela);
            vtela = TratamentoUltimoDigito(vtela);        
            vtela = RemoveZeroEsquerda(vtela);  
            vtela = TratamentoParenteses(vtela);  
            const r = eval(vtela || 0);
            setResultado(r)
            setOperacao(true);
        }catch{
            setResultado('ERRO');
        }
    }

    return (
        <div className="container">
            <div className="titulo">
                <h1>Calculadora</h1>
            </div>
            {Tela(valorTela, resultado)}
            <div className="buttons-space">
                {Button("AC", ()=>limparMemoria())}
                {Button("()", ()=>addParenteses())}
                {Button("%", ()=>addDigitoTela("%"))}
                {Button("/", ()=>addDigitoTela("/"))}<br/>
                {Button("7", ()=>addDigitoTela("7"))}
                {Button("8", ()=>addDigitoTela("8"))}
                {Button("9", ()=>addDigitoTela("9"))}
                {Button("*", ()=>addDigitoTela("*"))}<br/>
                {Button("4", ()=>addDigitoTela("4"))}
                {Button("5", ()=>addDigitoTela("5"))}
                {Button("6", ()=>addDigitoTela("6"))}
                {Button("-", ()=>addDigitoTela("-"))}<br/>
                {Button("1", ()=>addDigitoTela("1"))}
                {Button("2", ()=>addDigitoTela("2"))}
                {Button("3", ()=>addDigitoTela("3"))}
                {Button("+", ()=>addDigitoTela("+"))}<br/>
                {Button("0", ()=>addDigitoTela("0"))}
                {Button(".", ()=>addDigitoTela("."))}
                {Button("<-", ()=>Operacao("bs"))}
                {Button("=", ()=>Operacao("-"))}
            </div>
        </div>
    )
}