var MasterGame = document.querySelector('#MG')
var JugadorA = document.querySelector('#JA');
var JugadorB = document.querySelector('#JB');
var JugadorC = document.querySelector('#JC');
var JugadorD = document.querySelector('#JD');
var idJugador = document.querySelector('#idJugador')


//idJugador es el id del elemento hidden, cuyo valor se envía al servidor
// modificando esto podemos hacer una identificación


MasterGame.onclick = function(){
 	idJugador.value="Master_Game";
}

JugadorA.onclick = function(){
	//seleccion={value:"A"};
	//JugadorA.style.background='#66ffcc';
	idJugador.value="Jugador_A";
  	
  	//JugadorA.style.background='#66ffcc';
  	//options.path='/A';
  	//conectar(options);
}

JugadorB.onclick = function(){
 	idJugador.value="Jugador_B";
}

JugadorC.onclick = function(){
	idJugador.value="Jugador_C";
}

JugadorD.onclick = function(){
	idJugador.value="Jugador_D";
}
