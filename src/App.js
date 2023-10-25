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

const ClassificaUltimaLetra=(valorTela)=>{
    if (valorTela === "") {
        return 1;
    }
    let ultimaletra = valorTela.substring(valorTela.length - 1, valorTela.length);
    if (DetectaOperacao(ultimaletra)) {
        return 2; 
    }
    if (ultimaletra === "(") {
        return 3;  
    }
    if (ultimaletra === ".") {
        return 4;          
    }
    
}

const CorvertePorcentagem = (vtela) => {
    while (vtela.indexOf("%") !== -1) {
        let proximaletra = vtela.substring(vtela.indexOf("%"), vtela.indexOf("%") + 1)
        if (DetectaOperacao(proximaletra)){
            vtela = vtela.substring(0, vtela.indexOf("%")) + "/100" + vtela.substring(vtela.indexOf("%") +1, vtela.length);
        }
        else {
            vtela = vtela.substring(0, vtela.indexOf("%")) + "/100*" + vtela.substring(vtela.indexOf("%") +1, vtela.length);
        }
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
    while(vtela.indexOf(")(") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf(")(") +1) + "*" + vtela.substring(vtela.indexOf(")(")+1, vtela.length);
    }
    while(vtela.indexOf("%(") !== -1) {
        vtela = vtela.substring(0, vtela.indexOf("%(") +1) + "*" + vtela.substring(vtela.indexOf("%(")+1, vtela.length);
    }
    if (ClassificaUltimaLetra(vtela) === 3) {
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
    for(var i = 0; i < 4; i++){
        switch (ClassificaUltimaLetra(vtela)) {
            case 1:
            break;
            case 2:
                if (vtela.substring(vtela.length - 1, vtela.length) !== "%") {
                    vtela = vtela.substring(0, vtela.length - 1);
                }
            break;
            case 3:
                vtela = vtela.substring(0, vtela.length - 1);
            break;
            case 4:
                vtela = vtela.substring(0, vtela.length - 1);
            break;
        }
        let ultimo = vtela.substring(vtela.length -1, vtela.length);
        let pnultimo = vtela.substring(vtela.length -2, vtela.length -1);
        if (ultimo === ")" && DetectaOperacao(pnultimo)) {
            vtela = vtela.substring(0, vtela.length - 2);
        }
    }

    return vtela;
}

export default function App() {
    const [valorTela, setValorTela] = useState("");
    const [resultado, setResultado] = useState(0);
    const [operacao, setOperacao] = useState(false);
    const [erroDeFormatacao, setErroDeFormatacao] = useState(false);
    const [erroDeSistema, setErroDeSistema] = useState(false);

    const MessageBoxAlert=(mensagem) => {
        return(
            <>
                <div className="iconAlert" style={{display:(erroDeFormatacao)?"block":"none"}}>
                    <span>!</span>
                </div>
                <p>{mensagem}</p>
            </>
        )
    }
    const MessageBoxErro=(mensagem) => {
        return(
            <>
                <div className="iconErro" style={{display:(erroDeSistema)?"block":"none"}}>
                    <span><a href="https://github.com/arthurolando/github-course/issues" target="_blank">X</a></span>
                </div>
                <p>{mensagem}</p>
            </>
        )
    }

    const Tela=(val, res)=>{
        return(
            <div className="tela">
                <div className="MessageBox">
                    {erroDeSistema && operacao?MessageBoxErro("Infelizmente ocorreu um erro ao efetuar seu calculo, sinto muito. Por favor, clique no botão X e abra uma issues descrevendo seu erro para que eu possa solucionar o quanto antes."):""}               
                    {erroDeFormatacao && operacao?MessageBoxAlert("Um possivel erro de formatação foi detectado sua pergunta foi reformatada."):""}
                </div>
                <span>
                    <p className="valorTela" style={{color:((erroDeFormatacao && operacao)?"#aff":"#c1c1c1")}}>{valorTela}</p>
                    <p className="resultado" style={{color:((erroDeSistema && operacao)?"#ebad1d":"#fff")}}>{res}</p>
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
            switch (ClassificaUltimaLetra(valorTela)) {
                case 1:
                    if(d === "-") {
                        setValorTela(valorTela + d);
                    }
                break;
                case 2:
                    let vtela=valorTela;
                    let ultimaletra = valorTela.substring(valorTela.length - 1, valorTela.length);
                    let penultimaletra = valorTela.substring(valorTela.length - 2, valorTela.length -1);
                    if (ultimaletra === "*" || ultimaletra === "/") {
                        if (d === "-") {
                            setValorTela(vtela + d);
                            break
                        }
                        else {
                            vtela = vtela.substring(0,(vtela.length-1)) + d;
                        }
                    }
                    if (ultimaletra === "+" || ultimaletra === "-") {
                        if ((penultimaletra === "/" || penultimaletra === "*" || penultimaletra === "(" || penultimaletra === "." || penultimaletra === "") && (d === "*" || d === "/" || d === "%")) {
                            break;
                        }
                        vtela =  vtela.substring(0, vtela.length-1) + d;
                    }
                    if (ultimaletra === "%") {
                        if (d !== "%") {
                            vtela = vtela + d;
                        }
                    }

                    if(ClassificaUltimaLetra(vtela) === 3) {
                        if(d === "/" || d === "*" || d === "%") {
                            break;
                        }
                        setValorTela(valorTela + d);
                        break;
                    }
                    setValorTela(vtela);
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
        switch (ClassificaUltimaLetra(valorTela)) {
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
                    setOperacao(false);
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
            let vtela = valorTela;
            vtela = TratamentoUltimoDigito(vtela);        
            vtela = TratamentoParenteses(vtela);  
            if (vtela !== valorTela) {
                setValorTela(vtela);
                setErroDeFormatacao(true);
            } else {
                setErroDeFormatacao(false);
            }
            vtela = CorvertePorcentagem(vtela);
            vtela = RemoveZeroEsquerda(vtela);  
            const r = eval(vtela || 0);
            setErroDeSistema(false);
            setResultado(r)
            setOperacao(true);
        }catch{
            setOperacao(true);
            setResultado('ERRO');
            setErroDeSistema(true);
        }
    }

    return (
        <div className="container">
            <div className="titulo">
                <h1>Calculadora</h1>
            </div>
            {Tela(valorTela, resultado)}
            <div className="buttons-space">
                <div className="row">
                    {Button("AC", ()=>limparMemoria())}
                    {Button("()", ()=>addParenteses())}
                    {Button("%", ()=>addDigitoTela("%"))}
                    {Button("/", ()=>addDigitoTela("/"))}
                </div>
                <div className="row">
                    {Button("7", ()=>addDigitoTela("7"))}
                    {Button("8", ()=>addDigitoTela("8"))}
                    {Button("9", ()=>addDigitoTela("9"))}
                    {Button("*", ()=>addDigitoTela("*"))}     
                </div>
                <div className="row">                
                    {Button("4", ()=>addDigitoTela("4"))}
                    {Button("5", ()=>addDigitoTela("5"))}
                    {Button("6", ()=>addDigitoTela("6"))}
                    {Button("-", ()=>addDigitoTela("-"))}
                </div>
                <div className="row">
                    {Button("1", ()=>addDigitoTela("1"))}
                    {Button("2", ()=>addDigitoTela("2"))}
                    {Button("3", ()=>addDigitoTela("3"))}
                    {Button("+", ()=>addDigitoTela("+"))}
                </div>
                <div className="row">
                    {Button("0", ()=>addDigitoTela("0"))}
                    {Button(".", ()=>addDigitoTela("."))}
                    {Button("<-", ()=>Operacao("bs"))}
                    {Button("=", ()=>Operacao("-"))}
                </div>
            </div>

        </div>
    )
}