"use strict";

const axios = require('axios');
var jog1 = 0;
var jog2 = 0;
var jog3 = 0;
var pontos = Math.floor(Math.random() * 11);
var playerVez = Math.floor(Math.random() * 3)+1;
var plvcompleta = [];
var player = { 'jogador': '', 'pontos': 0}

function add_pontos(pontos, player){
  if(player === 1){
    jog1 = jog1 + pontos;
    document.getElementById("jogador1").innerHTML = "Jogador 1 tem " + jog1+" pontos";
  } else if (player === 2){
    jog2 = jog2 + pontos;
    document.getElementById("jogador2").innerHTML = "Jogador 2 tem " + jog2+" pontos";
  } else{
    jog3 = jog3 + pontos;
    document.getElementById("jogador3").innerHTML = "Jogador 3 tem " + jog3+"pontos";
  }
}

function next_player(player){
  if(player === 1){
    playerVez = 2
  } else if (player === 2){
    playerVez =  3;
  } else{
    playerVez = 1;
  }
  document.getElementById("player_view").innerHTML =  playerVez;
}

function validar(palavra, numeroPalavra){
  if (document.getElementById("plv"+numeroPalavra).value == palavra.toUpperCase()) {
    document.getElementById("palavra"+numeroPalavra).innerHTML = palavra.toUpperCase();
    add_pontos(50, playerVez);
    plvcompleta.push(numeroPalavra);
    win();
  } else{
    alert('Errou a palavra');
    document.getElementById("palavracorreta"+numeroPalavra).value = '';
    next_player(playerVez);
  }
}

window.addEventListener('load', function() {
  axios.get('http://localhost:8080/api').then(function(resposta){
    document.getElementById("dica").innerHTML = "Dica -> "+resposta.data[0]['tipo'];
    for(var i = 0; i< 3; i++){
      var aux = '';
      for (var j = 0; j < resposta.data[i]['palavra'].length; j++) {
        if (j == (resposta.data[i]['palavra'].length - 1)){
          aux = aux+'_';
        }else{
          aux = aux+'_ ';
        }
      }
      document.getElementById("palavra"+(i+1)).innerHTML = aux;
    }
    document.getElementById("jogador1").innerHTML = "Jogador 1 tem " + jog1+" pontos";
    document.getElementById("jogador2").innerHTML = "Jogador 2 tem " + jog2+" pontos";
    document.getElementById("jogador3").innerHTML = "Jogador 3 tem " + jog3+" pontos";
    document.getElementById("pontos").innerHTML = "Essa jogada está valendo " + pontos +" pontos";
    document.getElementById("player_view").innerHTML = playerVez;
    document.getElementById("plv1").value = resposta.data[0]['palavra'];
    document.getElementById("plv2").value = resposta.data[1]['palavra'];
    document.getElementById("plv3").value = resposta.data[2]['palavra'];

    console.log(resposta.data);
  }).catch(function (error){
    if (error){
      console.log('ferro -> '+error);
    }
  });
});

function escolheLetra(letra) {
  document.getElementById(letra).classList.add("disabled")
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
            add_pontos(pontos, playerVez);
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
    next_player(playerVez);
    var espaco = '';
    if (size > 0){
      espaco = ' - ';
    } else {
      espaco = ' ';
    }
    
    document.getElementById("letraserradas").innerHTML = document.getElementById("letraserradas").innerHTML+espaco+letra;
  }
  pontos = Math.floor(Math.random() * 11);
  document.getElementById("pontos").innerHTML = "Essa jogada está valendo " + pontos +" pontos";;
  win()
}

function win(){
  if(plvcompleta.includes(1) && plvcompleta.includes(2) && plvcompleta.includes(3)){
    var max = Math.max(jog1, jog2, jog3);
    if( jog1 === max){
      player.jogador = ' JOGADOR 1';
      player.pontos = jog1;
    } else if(jog2 === max){
      player.jogador = ' JOGADOR 2';
      player.pontos = jog2;
    } else{
      player.jogador = ' JOGADOR 3';
      player.pontos = jog3;
    }
    document.getElementById("conteudo").classList.add('display_none');
    document.getElementById("vencedor").classList.remove('display_none');
    document.getElementById("player-win").innerHTML = "PARABENS " + player.jogador;
    document.getElementById("player-ponts").innerHTML = "Você marcou " + player.pontos + " pontos";
  }
  
}