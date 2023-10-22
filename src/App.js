import React, { useState, useEffect } from "react";

export default function App() {
    const [valorTela, setValorTela] = useState("");
    const [resultado, setResultado] = useState(0);
    const [operacao, setOperacao] = useState(false);
    const [acumulador, setAcumulador] = useState(0);

    const Tela=(val, res)=>{
        return(
            <div>
                <span>{val}</span>=
                <span style={{color:"#3aa"}}>{res}</span>
            </div>
        )
    }

    const Button=(label, onClick)=>{
        return(
            <button onClick={onClick}>{label}</button>
        );
    }

    const addDigitoTela=(d) => {
        if ((d == "+" || d == "/" || d == "*" || d == "-") && operacao) {
            setOperacao(false);
            setValorTela(resultado + " " + d);
            return;
        }
        if (operacao) {
            setValorTela(d);
            setOperacao(false);
            return
        }
        setValorTela(valorTela + d);
    }
    const limparMemoria=()=>{
        setOperacao(false);
        setValorTela('');
        setResultado(0);
        setAcumulador(0);
        return
    }

    const Operacao=(oper)=>{
        if (oper=='bs') {
            let vtela=valorTela;
            vtela=vtela.substring(0,(vtela.length-1))
            setValorTela(vtela);
            setOperacao(false);
            return;
        }
        try{
            const r=eval(valorTela);
            setAcumulador(r);
            setResultado(r)
            setOperacao(true);
        }catch{
            setResultado('ERRO');
        }
    }

    return (
        <>
            <h1>Calculadora</h1>
            {Tela(valorTela, resultado)}
            {Button("AC", ()=>limparMemoria())}
            {Button("(", ()=>addDigitoTela("("))}
            {Button(")", ()=>addDigitoTela(")"))}
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
            {Button("=", ()=>Operacao("="))}
        </>
    )
}