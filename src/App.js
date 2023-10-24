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
            if (DetectaUltimo(valorTela) === 0) {
                return;
            }
            if (DetectaUltimo(valorTela) === 1) {
                let vtela=valorTela;
                vtela=vtela.substring(0,(vtela.length-1))
                setValorTela(vtela + d);
                return;    
            }
            if (DetectaUltimo(valorTela) === 2) {
                if(d === "%" || d === "*" || d === "/") {
                    return;
                }
                setValorTela(valorTela + d);
            }
            if (operacao) {
                setOperacao(false);
                setValorTela(resultado + d);
                return;   
            } 
            setValorTela(valorTela + d);
            return;
        } else {
            if (DetectaUltimo(valorTela) === 1) {
                setValorTela(valorTela + d);
                return;
            }
            if (operacao) {
                setValorTela(d);
                setOperacao(false);
                return;
            }
            setValorTela(valorTela + d);
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
            let stringDeletada = valorTela;

            vtela = vtela.substring(0, vtela.length - 1);
            
            stringDeletada = stringDeletada.substring(stringDeletada.length - 1, stringDeletada.length);

            if (stringDeletada === " ") {
                vtela = vtela.substring(0, vtela.length - 2);
                setValorTela(vtela);
                setOperacao(false);
                return;
            }
            setValorTela(vtela);
            setOperacao(false);
            return;
        }
        try{
            let vtela = EfetuaPorcentagem(valorTela);
            vtela = RemoveZeroEsquerda(vtela);            
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
                {Button("()", ()=>alert("Em manutenção"))}
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