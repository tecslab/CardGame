//Función para ver una carta y dejarla despues
//La carta la pide desde el servidor
function verCarta(carta){
	//Para pintar 1 carta seleccionadas
	selec1(carta);
	//Enviamos un comando con la carta a mostrarse
	socket.emit('command',{cmd:carta.id});
	//Recibimos el valor de la carta
	socket.on('commanda', function(data){
		carta.textContent=data.valor;
		setTimeout(function(){
			carta.textContent='';
			}, 3000);
		socket.off('commanda');
	});
}

// Pinta 2 cartas seleccionadas, de azul
// En butSelected se guardan los botones seleccionados
var flagClic = 0;
var butSelected = [];


function selec2(boton){
	boton.style.background='#66ffcc';
	butSelected.push(boton);

	if (flagClic==1){
		var bufferBotones = [...butSelected];
		flagClic++;
		setTimeout(function(){
			bufferBotones[0].style.background='#e7e7e7';
			bufferBotones[1].style.background='#e7e7e7';
			bufferBotones=[];
		}, 1500);
	}
	if (flagClic==0){
		flagClic++;
	}
}

function selec1(boton){
	boton.style.background='#66ffcc';
	setTimeout(function(){
		boton.style.background='#e7e7e7';
	}, 1500);
}

////////////////////////////////////////
///////////Instancia//////////

var cartasOcultas = [A5, A6, B5, B6, C5, C6, D5, D6];
//Se ocultan las cartas no iniciales
cartasOcultas.forEach(item => item.style.visibility = "hidden");