//Se definen las cartas y sus probabilidades
// set of object with probabilities:
//deberían sumar 1 si se busca que sea preciso
const set = { 1: 4 / 54, 2: 4 / 54, 3: 4 / 54, 4: 4 / 54, 5: 4 / 54, 6: 4 / 54, 7: 4 / 54, 8: 4 / 54, 9: 4 / 54, 10: 4 / 54, J: 4 / 54, Q: 4 / 54, KN: 2 / 54, KR: 2 / 54, JKR: 2 / 54 };
//const set = {7:1/7,8:1/7,9:1/7,10:1/7,J:1/7,Q:1/7,KN:1/7};
//const set = {7:1/7,8:1/7,9:1/7,10:1/7,J:1/7,KN:2/7};
//const set = {1:1/3,2:1/3,3:1/3};

console.log('pal git ');

// Se obtiene la suma para incluir casos 
// en los que no sea uno:
var sum = 0;
for (let j in set) {
    sum += set[j];
}

//Función para obtener un evento aleatorio a partir
//de una función de densidad de probabilidad
//Basado en una funcion de distribución de probabilidad acumulativa
function pick_random() {
    var pick = Math.random() * sum;
    for (let j in set) {
        pick -= set[j];
        if (pick <= 0) {
            return j;
        }
    }
}


function Carta(posicion) {
    this.valor = pick_random();
    //Posición es un numero del 1 a 6
    this.posicion = posicion;
    // costo es el valor numerico de la carta
    /*if (this.valor=='J' || this.valor=='Q'){
        this.costo=10;
    }
    if (this.valor == 'KN'){
        this.costo=13;
    }
    if (this.valor == 'KR'){
        this.costo = -1;
    }
    if (this.valor == 'JKR'){
        this.costo = 0;
    }else{
        this.costo = Number(this.valor);
    }*/


    this.costo = function () {
        if (this.valor == 'J' || this.valor == 'Q') {
            return 10;
        }
        if (this.valor == 'KN') {
            return 13;
        }
        if (this.valor == 'KR') {
            return -1;
        }
        if (this.valor == 'JKR') {
            return 0;
        } else {
            return Number(this.valor);
        }
    }
}

function Jugador(nombre, codigo) {
    this.nombre = nombre;
    this.codigo = codigo;//A,B,C,o D
    this.estado = "standBy";
    //this.cards = [new Carta('1'),new Carta('2'), new Carta('3'), new Carta('4')];
    this.cards = {
        1: new Carta('1'),
        2: new Carta('2'),
        3: new Carta('3'),
        4: new Carta('4'),
        5: 'None',
        6: 'None'
    };
    this.jugar = function () {
        console.log('Jugando');
    }
    this.getPosiciones = function () {
        var posiciones = [];
        for (let i in this.cards) {
            if (typeof (this.cards[i]) == 'string') {
                // Si es string entonces es 'None'
                posiciones.push(String(i));
            }
        }
        return posiciones;
    }
    this.pushCard = function (posicion) {
        //this.cards.push(new Carta(posicion));
        this.cards[posicion] = new Carta(posicion);
    }
    this.getCard = function (posicion) {
        return this.cards[posicion].valor;
    }
    this.deleteCard = function (posicion) {
        this.cards[posicion] = 'None';
    }
    // Imprime en pantalla el valor de la carta, o 'None'
    this.print = function () {
        for (let i in this.cards) {
            if (typeof (this.cards[i]) == 'object') {
                console.log(this.cards[i].valor);
            }
            else {
                console.log(this.cards[i]);
            }
        }
    }
    this.cartas = function () {
        var cartasJ = [];
        for (let i in this.cards) {
            if (typeof (this.cards[i]) == 'object') {
                cartasJ.push(this.cards[i].valor);
            }
            else {
                cartasJ.push(this.cards[i]);
            }
        }
        return cartasJ;
    }

    this.suma = function () {
        var suma = 0;
        for (let i in this.cards) {
            if (typeof (this.cards[i]) == 'object') {
                suma = suma + this.cards[i].costo();
            }
        }
        return String(suma);
    }
}


var efectosCartas = {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'Carta_Ajena',
    8: 'Carta_Ajena',
    9: 'Carta_Propia',
    10: 'Carta_Propia',
    J: 'Cambiar',
    Q: 'Cambiar',
    KR: 'None',
    KN: 'Ver_y_Cambiar',
    JKR: 'None',
}


var mecanicasJuego = {
    Jugador: Jugador,
    pick_random: pick_random,
    efectosCartas: efectosCartas
}

module.exports = mecanicasJuego;