
var modelo = require("./modelo.js");

describe("El juego del impostor", function () {
	var juego;
	var nick;
	var test

	beforeEach(function () {
		test = "test";
		juego = new modelo.Juego(4, test);
		//usr = new modelo.Usuario("Pepe", juego);
		nick = "Pepe"
	});

	it("comprobar valores iniciales del juego", function () {
		expect(Object.keys(juego.partidas).length).toEqual(0);
		expect(nick).toEqual("Pepe");
		expect(juego).not.toBe(undefined);
	});

	describe("el usr Pepe crea una partida de 4 jugadores", function () {
		var codigo;
		beforeEach(function () {
			codigo = juego.crearPartida(4, nick);
		});

		it("se comprueba la partida", function () {
			expect(codigo).not.toBe(undefined);
			expect(juego.partidas[codigo].nickOwner).toEqual(nick);
			expect(juego.partidas[codigo].maximo).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(1);
		});

		it("varios usuarios se unen a la partida", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		});

		it("Pepe inicia la partida", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		})

		it("Pepe abandona la partida ya empezada", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			juego.partidas[codigo].usuarios[nick].abandonarPartida();
			//expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		});

		it("Pepe abandona la partida sin empezar", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.partidas[codigo].usuarios[nick].abandonarPartida();
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		})

		it("Todos abandonan la partida", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			var partida = juego.partidas[codigo];
			partida.usuarios["tomas"].abandonarPartida();
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			partida.usuarios["isa"].abandonarPartida();
			partida.usuarios["ana"].abandonarPartida();
			partida.usuarios["Pepe"].abandonarPartida();
			expect(partida.numJugadores()).toEqual(3);
			//expect(juego.partidas[codigo]).toBe(undefined)
		})

		it("Los encargos han sido asignados", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			for (var key in juego.partidas[codigo].usuarios) {
				expect(juego.partidas[codigo].usuarios[key].encargo).not.toEqual("ninguno");
			}
		})

		it("Los impostores han sido asignados", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			var esImpostor = false;
			for (var key in juego.partidas[codigo].usuarios) {
				if (juego.partidas[codigo].usuarios[key].impostor == true) {
					esImpostor = true;
				};
			}
			expect(esImpostor).toEqual(true);
		})
		it("Impostor mata", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			var contMuertos = 0;
			for (var key in juego.partidas[codigo].usuarios) {
				if (juego.partidas[codigo].usuarios[key].impostor == true) {
					var impo = key;
				};
				if (juego.partidas[codigo].usuarios[key].impostor == false) {
					var ciudadano = key;
				};
			}
			juego.partidas[codigo].usuarios[impo].atacar(ciudadano);
			for (var key in juego.partidas[codigo].usuarios) {

				if (juego.partidas[codigo].usuarios[key].estado.nombre == "muerto") {
					contMuertos++;
				};
			}
			expect(contMuertos).not.toEqual(0);
		})

		it("Ganan impostores", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			juego.unirAPartida(codigo, "tomas");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(4);
			expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
			juego.iniciarPartida(nick, codigo);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			var contMuertos = 0;
			for (var key in juego.partidas[codigo].usuarios) {
				if (juego.partidas[codigo].usuarios[key].impostor == true) {
					var impo = key;
				};
			}
			for (var key in juego.partidas[codigo].usuarios) {
				if (juego.partidas[codigo].usuarios[key].impostor == false) {
					juego.partidas[codigo].usuarios[impo].atacar(key);
				};
			}
			var victoria = juego.partidas[codigo].gananImpostores();
			expect(victoria).toBe(true);
		})

	});

	describe("el usr Pepe crea una partida de pocos jugadores", function () {
		var codigo;
		beforeEach(function () {
			codigo = juego.crearPartida(3, nick);
		});
		it("se comprueba la partida", function () {
			expect(codigo).toBe("undefined");
		});
	})

	describe("el usr Pepe crea una partida de muchos jugadores", function () {
		var codigo;
		beforeEach(function () {
			codigo = juego.crearPartida(11, nick);
		});
		it("se comprueba la partida", function () {
			expect(codigo).toBe("undefined");
		});
	})

	describe("Lista de partidas", function () {
		var codigo;
		beforeEach(function () {
			codigo = juego.crearPartida(5, nick);
		});
		it("se comprueba la partida", function () {
			juego.unirAPartida(codigo, "ana");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			expect(juego.partidas[codigo].obtenerHuecos()).toEqual(3);
			juego.unirAPartida(codigo, "isa");
			var num = Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
			expect(juego.partidas[codigo].obtenerHuecos()).toEqual(2);
			juego.unirAPartida(codigo, "tomas");
			expect(juego.partidas[codigo].obtenerHuecos()).toEqual(1);
			expect(juego.listaPartidas()).toEqual([{ "codigo": codigo, "owner": nick }]);
			juego.unirAPartida(codigo, "rafa");
			expect(juego.listaPartidas()).toEqual([{ "codigo": codigo, "owner": nick }]);
			expect(juego.listaPartidasDisponibles()).toEqual([]);
		});


		describe("las votaciones", function () {
			beforeEach(function () {
				juego.unirAPartida(codigo, "ana");
				juego.unirAPartida(codigo, "isa");
				juego.unirAPartida(codigo, "tomas");
				juego.iniciarPartida(nick, codigo);
			});

			it("todos skipean", function () {
				var partida = juego.partidas[codigo];
				juego.lanzarVotacion(nick, codigo);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto(nick, codigo);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto("ana", codigo);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto("isa", codigo);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto("tomas", codigo);
				expect(partida.fase.nombre).toEqual("jugando");
			});
			it("se vota y mata a un inocente", function () {
				var partida = juego.partidas[codigo];
				juego.lanzarVotacion(nick, codigo);

				partida.usuarios[nick].impostor = true;
				partida.usuarios["ana"].impostor = false;
				partida.usuarios["isa"].impostor = false;
				partida.usuarios["tomas"].impostor = false;

				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(nick, codigo, "tomas");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("ana", codigo, "tomas");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("isa", codigo, "tomas");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("tomas", codigo, "isa");
				expect(partida.usuarios["tomas"].estado.nombre).toEqual("muerto");
			});

			it("se vota y mata al impostor, la partida termina", function () {
				var partida = juego.partidas[codigo];
				juego.lanzarVotacion(nick, codigo);

				partida.usuarios[nick].impostor = true;
				partida.usuarios["ana"].impostor = false;
				partida.usuarios["isa"].impostor = false;
				partida.usuarios["tomas"].impostor = false;

				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(nick, codigo, "tomas");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("ana", codigo, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("isa", codigo, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar("tomas", codigo, nick);
				expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
			});

			it("impostor ataca a todos y gana", function () {
				var partida = juego.partidas[codigo];

				partida.usuarios[nick].impostor = true;
				partida.usuarios["ana"].impostor = false;
				partida.usuarios["isa"].impostor = false;
				partida.usuarios["tomas"].impostor = false;

				juego.atacar(nick, codigo, "ana");
				expect(partida.usuarios["ana"].estado.nombre).toEqual("muerto");
				juego.atacar(nick, codigo, "isa");
				expect(partida.usuarios["isa"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final")
			});

			it("realizarTareas", function () {
				var partida = juego.partidas[codigo];
				key = 0
				for (var key in partida.usuarios) {
					partida.usuarios[key].realizarTareas();
				}
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.obtenerPorcentajeGlobal()).toEqual(100);
				expect(partida.fase.nombre).toEqual("final");
			})
		});
	});
});