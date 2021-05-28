
var socket = io.connect('http://' + ip + ':' + port);

//var socket = io.connect('http://127.0.0.1:3000');
//var socket = io.connect('http://169.51.203.55:30195');
var instruccion = document.getElementById("instruccion");

//id se obtiene del script general
//tiene esta estructura 'Jugador_[letra]' o 'Master_Game'
//Se espera que el servidor nos pida el id
socket.on('identification', function(data){
Descarte.textContent=data.cartaDescarte;
//Enviamos nuestro id
//El id tiene esta estructura: Jugador_A(B,C,D)
	socket.emit('message',{id:id});	

	if (id=="Master_Game"){
		iniciar.onclick=function(){
			socket.emit('command',{cmd:"start"});
		}
		pasar.onclick=function(){
			socket.emit('command',{cmd:"pass"});
		}
		terminar.onclick=function(){
			socket.emit('command',{cmd:"finish"});
		}
		reset.onclick=function(){
			socket.emit('command',{cmd:'reset'});
		}	

	}else{ 
		//Si es un Jugador
		//El botón de actualizar permite actualizar el estado de la partida por si hubo alguna des sincronización
		var actualizar = document.getElementById("actualizar");
		//botones de los poderes
		var pow_suma = document.getElementById("pow_suma");
		var pow_cartas = document.getElementById("pow_cartas");
		var powers = [pow_suma, pow_cartas];

		//EN cualquier momento se puede activar los poderes
		for (let i in powers){
			powers[i].onclick=function(){
				//Bloqueamos los poderes, solo se puede usar uno.
				for (let j in powers){
					powers[j].onclick=function(){}
				}
				socket.emit('cmd_J',{cmd:powers[i].value});
				//Se recibe la respuesta del poder y se lo muestra en la seccion instruccion
				socket.on('res_power', function(data){
					//instruccion.textContent=data.respuesta;
					//console.log(powers[i].value);
					if (powers[i].value=='ver_cartas'){
						var m=0;
						for (let k in arrayCartas){
							for(let l in arrayCartas[k]){
								arrayCartas[k][l].textContent=data.respuesta[m][l];
							}
							m=m+1;
						}
						setTimeout(function(){
							for (let k in arrayCartas){
								for(let l in arrayCartas[k]){
									arrayCartas[k][l].textContent="";
								}
							}
						}, 5000);
					}else if(powers[i].value=='sumar'){
						//console.log(A);
						var divsJugadores=[A,B,C,D];
						for (let k in divsJugadores){
							//console.log(k);
							var sumNode =document.createTextNode(data.respuesta[k]);
							divsJugadores[k].appendChild(sumNode);
						}
					}
					
				});
			}
		}


		// se recibe una actualización con el estado de las cartas (Si son visibles o ocultas)
		//En este formato: {A:['v','v','o'...],B:[....],...}
		actualizar.onclick = function(){
			socket.emit('act', {cmd:'actualizarPartida'});
			socket.on('actualizacion', function(data){
				console.log('recibido actualización');
				console.log(data);
				for (let i in data['A']){
					if (data['A'][i]=='v'){
						arrayCartas['CartasA'][i].style.visibility='visible';
					}else{
						arrayCartas['CartasA'][i].style.visibility='hidden';
					}

				if (data['B'][i]=='v'){
						arrayCartas['CartasB'][i].style.visibility='visible';
					}else{
						arrayCartas['CartasB'][i].style.visibility='hidden';
					}

				if (data['C'][i]=='v'){
						arrayCartas['CartasC'][i].style.visibility='visible';
					}else{
						arrayCartas['CartasC'][i].style.visibility='hidden';
					}
				if (data['D'][i]=='v'){
						arrayCartas['CartasD'][i].style.visibility='visible';
					}else{
						arrayCartas['CartasD'][i].style.visibility='hidden';
					}
				}
			});
		}

		//Esperamos por una instruccion de servidor
		socket.on('instruccion', function(data){
			//Si la intruccion es de "inicien", los jugadores deben sleccionar una de sus cartas
			//** Aveces no llega el mensajes de instruccion
			if (data.text=="Inicien"){
				console.log('Iniciando');
				instruccion.textContent= "Seleccionar una carta propia";
				for (let i in cartasPropias){
					cartasPropias[i].onclick=function(){
						//Se pide, obtiene y muestra el valor de la carta desde el servidor
						verCarta(cartasPropias[i]);
						//Bloqueamos las cartas
						for (let j in cartasPropias){
							cartasPropias[j].onclick=function(){}
						}
					}
				}
			}

			if (data.text=='Pasar'){
				//token es una letra que corresponde al jugador que tiene el turno
				//si el id = token entonces es el turno del jugador
				var turno = data.token;
				console.log('pasar');
				//bloqueamos las cartas en juego
				for (let i in arrayCartas){
					for (let j in arrayCartas[i]){
						arrayCartas[i][j].onclick=function(){}
					}
				}
				instruccion.textContent= turno + ": Clic en Mazo o Descarte";
				//Se colorea el area del jugador que le toca
				//Las zonas están definidas en game.jade
				for (let i in zonas){
					if (zonas[i].id==turno){
						zonas[i].style.backgroundColor= '#187974';
					}else{
						zonas[i].style.backgroundColor= 'white';
					}
				}

				console.log("Turno: " + turno + " id: " + id[8]);

				//si es el turno del jugador
				//activamos el mazo y descarte
				if (id[8]==turno){
					Mazo.onclick=function(){
						//Pintamos el mazo
						selec1(Mazo);
						//Bloqueamos las cartas del Mazo y descarte
						Mazo.onclick=function(){}
						Descarte.onclick=function(){}
						//Pedimos la carta del mazo
						socket.emit('generar', {text:'generar'});
						//se recibe la carta revelada en el Mazo
						socket.on('cartaMazo', function(data){
							//La carta recibida se visualiza en el Mazo.
							Mazo.textContent=data.carta;
							//console.log('Valor carta: ' + data.carta);
							console.log('Efecto: '+ data.efecto);
							//console.log("turno: " + turno + " id: " + id[8]);
							//Si la carta tiene efecto, se activa este efecto ahora
							if (data.efecto=='Carta_Propia'){
								instruccion.textContent= turno + ": Ver carta propia";
								//Se debe seleccionar una de sus cartas
								for (let i in cartasPropias){
									cartasPropias[i].onclick=function(){
							//Se pide, obtiene y muestra el valor de la carta desde el servidor
							// verCarta es asincrono
										verCarta(cartasPropias[i]);
										//La carta del mazo se cola en descarte
										Descarte.textContent=Mazo.textContent
										Mazo.textContent='Mazo';
										socket.emit('actualizarDescarte',{actDescarte:data.carta, cartaPintar:cartasPropias[i].id});
										//Bloqueamos las cartas
										for (let j in cartasPropias){
											cartasPropias[j].onclick=function(){}
										}

										socket.emit('pasar2fase', {señal:'fase2'});

									}
								}
							}
							if (data.efecto=='Carta_Ajena'){
								instruccion.textContent= turno + ": Ver cualquier carta";
								for (let i in arrayCartas){
									for (let j in arrayCartas[i]){
										arrayCartas[i][j].onclick=function(){
											verCarta(arrayCartas[i][j]);
											//La carta del mazo se cola en descarte
											Descarte.textContent=Mazo.textContent;
											Mazo.textContent='Mazo';
											socket.emit('actualizarDescarte',{actDescarte:data.carta, cartaPintar: arrayCartas[i][j].id});
											//Bloqueamos las cartas
											for (let i in arrayCartas){
												for (let j in arrayCartas[i]){
													arrayCartas[i][j].onclick=function(){}
												}
											}
											socket.emit('pasar2fase', {señal:'fase2'});
										}
									}
								}
							}
							if (data.efecto=='Cambiar'){
								instruccion.textContent= turno + ": Cambio a ciegas";
								for (let i in arrayCartas){
									for (let j in arrayCartas[i]){
										arrayCartas[i][j].onclick=function(){
											selec2(arrayCartas[i][j]);

											if (flagClic==2){
												//Enviamos las cartas a cambiarse al servidor
												//butSelected está en script.js
												socket.emit('cambio',{cmd:'cambiar', carta1: butSelected[0].id, carta2: butSelected[1].id});

												flagClic=0;
												butSelected=[];
												//La carta del mazo se cola en descarte
												Descarte.textContent=Mazo.textContent
												Mazo.textContent='Mazo';
												//Se actualiza el descarte
												socket.emit('actualizarDescarte',{actDescarte:data.carta, cartaPintar: 'Descarte'});
												for (let i in arrayCartas){
													for (let j in arrayCartas[i]){
														arrayCartas[i][j].onclick=function(){}
													}
												}
												//Se pasa a la siguiente fase
												socket.emit('pasar2fase', {señal:'fase2'});
											}
										}
									}
								}
							}
							if (data.efecto=='Ver_y_Cambiar'){
								instruccion.textContent= turno + ": Seleccionar una carta para ver";
								//Se habilitan todas las cartas para verlas
								for (let i in arrayCartas){
									for (let j in arrayCartas[i]){
										arrayCartas[i][j].onclick=function(){
											//Se pide, obtiene y muestra el valor de la carta desde el servidor
											arrayCartas[i][j].style.background='#66ffcc';
											butSelected.push(arrayCartas[i][j]);
											//Se habilitan clics en 2 botones
											if (flagClic==0){
												//Si es la primera carta (carta a ver)
												verCarta(arrayCartas[i][j]);
												socket.emit('pintarSoloUna',{cartaPintar:arrayCartas[i][j].id})
												instruccion.textContent= turno + ": Seleccionar carta a cambiar o dejarla ahí";
												flagClic++;
											}else{
												//La segunda carta tiene 2 opciones: clic en la carta propia y en otra
												if (flagClic==1){
													flagClic=0;
													//bloqueamos las cartas
													for (let i in arrayCartas){
														for (let j in arrayCartas[i]){
															arrayCartas[i][j].onclick=function(){}
														}
													}
													var bufferBotones = [...butSelected];
													//Si se dio clic en el mismo boton
													if (bufferBotones[0]==bufferBotones[1]){
														butSelected=[];
														setTimeout(function(){
															bufferBotones[0].style.background='#e7e7e7';
															bufferBotones=[];
														}, 1000);
									
													}else{
														setTimeout(function(){
															bufferBotones[0].style.background='#e7e7e7';
															bufferBotones[1].style.background='#e7e7e7';
															bufferBotones=[];
														}, 500);

														socket.emit('cambio',{cmd:'cambiar', carta1: butSelected[0].id, carta2: butSelected[1].id});
														butSelected=[];
													}
													//La carta del mazo se cola en descarte
													Descarte.textContent=Mazo.textContent
													Mazo.textContent='Mazo';
													socket.emit('actualizarDescarte',{actDescarte:data.carta, cartaPintar: 'Descarte'});
													socket.emit('pasar2fase', {señal:'fase2'});
												}
											}
										}
									}
								}
							}
							if (data.efecto=='None'){
								instruccion.textContent= turno + ": Descartar carta o cambiala por una tuya";
								Descarte.onclick=function(){
									selec1(Descarte);
									//bloqueamos cartas
									Descarte.onclick=function(){}
									for (let i in cartasPropias){cartasPropias[i].onclick=function(){}}
									Descarte.textContent=data.carta;
									Mazo.textContent='Mazo';
									socket.emit('actualizarDescarte', {actDescarte:data.carta, cartaPintar: 'Descarte'});
									console.log('enviadoDescarte');
									socket.emit('pasar2fase', {señal:'fase2'});
								}
								//Para cambiar por una carta propia
								for (let i in cartasPropias){
									cartasPropias[i].onclick=function(){
										Descarte.onclick=function(){}
										for (let j in cartasPropias){cartasPropias[j].onclick=function(){}}
										selec1(cartasPropias[i]);
									//Se envia el id de la carta a cambiar y el id 'Mazo'
										socket.emit('cambio',{cmd:'cambiar', carta1: cartasPropias[i].id, carta2: 'Mazo'});
										//Se pintan las cartas y se actuliza el descarte
										socket.on('pintar1', function(data){
											Mazo.textContent='Mazo';
											console.log('carta a pintar: ' + data.actDescarte);
											Descarte.textContent=data.actDescarte;
											selec1(Descarte);
											socket.off('pintar1');
										});
										socket.emit('pasar2fase', {señal:'fase2'});
									}
								}
							}
						socket.off('cartaMazo');
						});
					}
					//Si toca la carta en descarte
					Descarte.onclick=function(){
						//selec1(Descarte);
						Descarte.style.background='#66ffcc';
						//Bloqueamos estos botones
						Mazo.onclick=function(){}
						Descarte.onclick=function(){}
						//Habilitamos las cartas del jugador para cambiarlas
						for (let i in cartasPropias){
							cartasPropias[i].onclick=function(){
								selec1(Descarte);
								selec1(cartasPropias[i]);
								//deshabilitamos las cartas
								for (let j in cartasPropias){cartasPropias[j].onclick=function(){}}
								//Enviamos un mensaje para hacer el cambio de las cartas
								socket.emit('cambio',{cmd:'cambiar', carta1: cartasPropias[i].id, carta2: 'Descarte'});
								//Se envia un msj a los otros jugadores para que pinten las cartas
								// cambiadas y actualizar el descarte
								socket.on('pintar1', function(data){
									//Se actualiza el valor de Descarte
									console.log('Recibido descarte: ' + data.actDescarte);
									Descarte.textContent=data.actDescarte;
									socket.off('pintar1');
								});
								socket.emit('pasar2fase', {señal:'fase2'});
							}
						}
					}
				//Si no es su turno
				}else{
					//se escucha por si hay una actualización para el Mazo
					socket.on('cartaMazo', function(data){
						console.log('recibido Mazo');
						Mazo.textContent=data.carta;
						selec1(Mazo);
						if (data.efecto=='Carta_Propia'){
							instruccion.textContent= turno + ": Ver carta propia";
						}
						if (data.efecto=='Carta_Ajena'){
							instruccion.textContent= turno + ": Ver cualquier carta";
						}
						if (data.efecto=='Cambiar'){
							instruccion.textContent= turno + ": Cambio a ciegas";
						}
						if (data.efecto=='Ver_y_Cambiar'){
							instruccion.textContent= turno + ": Cambio a ciegas";
						}
						if (data.efecto=='None'){
							instruccion.textContent= turno + ": Cambiar o descartar";
						}
					});
					//Recibimos los codigos de las cartas cambiadas y las pintamos
					socket.on('pintar', function(data){
						console.log('Recibido pintar');
						console.log("turnoSecond: " + turno + " id: " + id[8]);
						var carta1 = document.getElementById(data.carta1);
						var carta2 = document.getElementById(data.carta2);
						carta1.style.background='#66ffcc';
						carta2.style.background='#66ffcc';
						setTimeout(function(){
							carta1.style.background='#e7e7e7';
							carta2.style.background='#e7e7e7';
						}, 3000);
						if (data.carta2=='Descarte'){
							//Actualizacion de cartadescarte
							Descarte.textContent=data.actDescarte;
						}
					});
					socket.on('actDescarteServ', function(data){
						var cartaPintar=document.getElementById(data.cartaPintar);
						console.log('recibidoDescServ');
						Descarte.textContent=data.actDescarte;
						Mazo.textContent='Mazo';
						selec1(cartaPintar);
						//selec1(Mazo);
						selec1(Descarte);
					});
					socket.on('pintarSoloUna', function(data){
						var cartaPintar = document.getElementById(data.cartaPintar);
						selec1(cartaPintar);
					});

					socket.on('resComparar', function(data){
						var cartaActual = document.getElementById(data.carta);
						console.log(cartaActual);
						if (data.accion=='quitar'){										
							cartaActual.style.visibility = "hidden";
						}
						if (data.accion=='agregar'){
							cartaActual.style.visibility = "visible";
						}
					});
				}
			}
			//Fase para descartar cartas
			if (data.text=='segundaFase'){
				instruccion.textContent= "Fase de descarte de cartas";
				//Activamos todas las cartas de los jugadores
				for (let i in arrayCartas){
					for (let j in arrayCartas[i]){
						arrayCartas[i][j].onclick=function(){
							arrayCartas[i][j].style.background='#66ffcc';
						//Bloqueamos cartas
							for (let k in arrayCartas){
								for (let l in arrayCartas[k]){
									arrayCartas[k][l].onclick=function(){}
								}
							}
							//
							Descarte.onclick=function(){
								Descarte.onclick=function(){}
								selec1(arrayCartas[i][j]);
								selec1(Descarte);
								socket.emit('comparar', {Descarte:'Descarte', carta:arrayCartas[i][j].id, idJugador: id});
								socket.on('resComparar', function(data){
									var cartaActual = document.getElementById(data.carta);
									console.log(cartaActual);
									if (data.accion=='quitar'){	
										instruccion.textContent= turno + " :Carta descartada";
										cartaActual.style.visibility = "hidden";
									}
									if (data.accion=='agregar'){
										instruccion.textContent= turno + " :Carta Agregada";
										cartaActual.style.visibility = "visible";
									}
									if (data.accion=='pedirCarta'){
										//Si las cartas son iguales y nos piden una carta propia
										instruccion.textContent= turno + ": Seleccionar una carta propia";
										for (let k in cartasPropias){
											cartasPropias[k].onclick=function(){
												//bloqueo de cartas
												for (let l in cartasPropias){
													cartasPropias[l].onclick=function(){}													
												}

												socket.emit('cartaEliminar',{carta:cartasPropias[k].id});
												cartasPropias[k].style.visibility = 'hidden';

												/*socket.on('resComparar2', function(data){
													var cartaEliminar = document.getElementById(data.carta);
													cartaEliminar.style.visibility = 'hidden';
													socket.off('resComparar2');
												});*/
											}											
										}
									}
									socket.off('resComparar');
								});
							}
						}
					}
				}
			}
		});
		socket.on('resultados', function(data){
			instruccion.textContent= "Resultados: Suma: " + data.suma + " Cartas: " + data.cartas;

		});
	}
});