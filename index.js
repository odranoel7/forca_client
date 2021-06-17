"use strict";

const getws = 'ws://localhost:8080/';
const WebSocket = require('ws');
//const prompt = require('electron-osx-prompt');
const ws = new WebSocket(getws);

const axios = require('axios');
let id = -99;

var pontos = -99;
var pontoAcumulado = -99;
var playerVez = Math.floor(Math.random() * 3)+1;
var plvcompleta = Array();

var preenchimento = Array();
var letraserradas = Array();
var palavrasacertadas = {
  um: false,
  dois: false,
  tres: false
}

ws.on('error', error => {
  alert('Erro -> '+error);
});

function validar(palavra, numeroPalavra){
  document.getElementById("plvcerta"+numeroPalavra).value = '';
  if (document.getElementById("plv"+numeroPalavra).value == palavra.toUpperCase()) {
    document.getElementById("palavra"+numeroPalavra).innerHTML = palavra;
    if (numeroPalavra == 1){
      palavrasacertadas.um = true;
    } else if (numeroPalavra == 2){
      palavrasacertadas.dois = true;
    }  else if (numeroPalavra == 3){
      palavrasacertadas.tres = true;
    }
    var auxEnviar = {
      palavra:       palavra,
      numeroPalavra: numeroPalavra,
      selecao:       'palavras_acerto'
    };
    console.log(palavrasacertadas);

    if ((palavrasacertadas.um == true) && (palavrasacertadas.dois == true) && (palavrasacertadas.tres == true)){
      alert('acabou o jogo');
    }

    ws.send(JSON.stringify(auxEnviar));
  } else{
    alert('Errou a palavra');
  }
  
}

ws.on('message', function ponto(pontoRodada){
  var aux = JSON.parse(pontoRodada);

  console.log(aux);
  pontos = aux.valor;
  if (id == -99) {
    id = aux.idjog;
  }
  pontoAcumulado = aux.pontoAcumulado[id];
  document.getElementById("pontos").innerHTML = "Essa jogada está valendo " + pontos +" pontos";
  document.getElementById("jogador").innerHTML = "Você é o Jogador "+id;
  
  document.getElementById("tempontos").innerHTML = "Você tem "+pontoAcumulado+" pontos";
  document.getElementById("player_view").innerHTML = "Jogador "+aux.jogadorvez;
  
  
  if(id == aux.jogadorvez){
    document.getElementById("letras").classList.remove("disabled");
  } else {
    document.getElementById("letras").classList.add("disabled");
  }
  document.getElementById("dica").innerHTML = "Dica -> "+aux.dica;
  montaPalavras(aux.palavras);

  if (aux.palavrasPreenhidas.length > 0){
    document.getElementById("palavra1").innerHTML = aux.palavrasPreenhidas[0];
    document.getElementById("palavra2").innerHTML = aux.palavrasPreenhidas[1];
    document.getElementById("palavra3").innerHTML = aux.palavrasPreenhidas[2];
  }
  if (aux.letraserradas.length > 0){
    document.getElementById("letraserradas").innerHTML = aux.letraserradas;
  } 
  if (aux.palavrasCorretaUm.length > 0){
    document.getElementById("palavra1").innerHTML = aux.palavrasCorretaUm;
  } 
  if (aux.palavrasCorretaDois.length > 0){
    document.getElementById("palavra2").innerHTML = aux.palavrasCorretaDois;
  } 
  if (aux.palavrasCorretaTres.length > 0){
    document.getElementById("palavra3").innerHTML = aux.palavrasCorretaTres;
  }
});

function montaPalavras(palavras){
  for(var i = 0; i< 3; i++){
    var aux = '';
    for (var j = 0; j < palavras[i]['palavra'].length; j++) {
      if (j == (palavras[i]['palavra'].length - 1)){
        aux = aux+'_';
      }else{
        aux = aux+'_ ';
      }
    }
    //console.log(aux);
    document.getElementById("palavra"+(i+1)).innerHTML = aux;
  }
  document.getElementById("plv1").value = palavras[0]['palavra'];
  document.getElementById("plv2").value = palavras[1]['palavra'];
  document.getElementById("plv3").value = palavras[2]['palavra'];
}

window.addEventListener('load', function() {
 
});

function escolheLetra(letra) {
  var existeletra = false;
  for(var i = 1; i <= 3; i++){
    if(!plvcompleta.includes(i)){
      var palavra = document.getElementById("plv"+i).value;
      if(palavra.includes(letra)){
        var aux = document.getElementById("palavra"+i).innerHTML.split(' ');
        for(var j = 0; j < palavra.length; j++){
          if (palavra[j] == letra){
            existeletra = true;
            aux[j] = letra;
            document.getElementById("player_view").innerHTML = playerVez;
          }
        }
        document.getElementById("palavra"+i).innerHTML = aux.join(' ');
        console.log(!aux.includes("_"));
        if (!aux.includes("_")){
          plvcompleta.push(i);
          console.log(plvcompleta)
        }
      }
    }
  }
  if (!existeletra) {
    alert('Não tem a letra '+letra);
    var size = document.getElementById("letraserradas").innerHTML.length;
    
    var espaco = '';
    if (size > 0){
      espaco = ' - ';
    } else {
      espaco = ' ';
    }
    document.getElementById("letraserradas").innerHTML = document.getElementById("letraserradas").innerHTML+espaco+letra;
  }
  preenchimento = Array();
  preenchimento.push(document.getElementById("palavra1").innerHTML);
  preenchimento.push(document.getElementById("palavra2").innerHTML);
  preenchimento.push(document.getElementById("palavra3").innerHTML);
  
  letraserradas = Array();
  letraserradas.push(document.getElementById("letraserradas").innerHTML);
  console.log('passei');
  var auxEnviar = {
    palavras     : preenchimento,
    letraserradas: letraserradas,
    idjog        : id,
    pontosAc     : pontoAcumulado,
    selecao      : 'tracos_palavras_erradas'
  };

  if (existeletra){
    auxEnviar.pontosAc = (pontoAcumulado+pontos);
  }
  

  ws.send(JSON.stringify(auxEnviar));

  /* pontos = Math.floor(Math.random() * 11);
  document.getElementById("pontos").innerHTML = "Essa jogada está valendo " + pontos +" pontos"; */
}
