function ClienteWS() {
    var cw = new ControlWeb($);
    this.socket = undefined;
    this.nick = undefined;
    this.codigo = undefined;
    this.owner = false;
    this.numJugador = undefined;
    this.impostor;
    this.encargo;
    this.estado;
    this.crearPartida = function (nick, numero) {
        this.nick = nick;
        this.socket.emit("crearPartida", nick, numero);//{"nick":nick, "num":num}
    }
    this.unirAPartida = function (nick, codigo) {
        this.socket.emit("unirAPartida", nick, codigo);//{"nick":nick, "codigo":codigo}
    }
    this.iniciarPartida = function () {
        this.socket.emit("iniciarPartida", this.nick, this.codigo)//,nick,codigo);//{"nick":nick, "codigo":codigo}
    }
    this.listaPartidas = function () {
        this.socket.emit("listaPartidas")
    }
    this.listaPartidasDisponibles = function () {
        this.socket.emit("listaPartidasDisponibles")
    }

    this.lanzarVotacion = function () {
        this.socket.emit("lanzarVotacion", this.nick, this.codigo)
    }

    this.saltarVotacion = function () {
        this.socket.emit("saltarVotacion", this.nick, this.codigo)
    }

    this.votar = function (sospechoso) {
        this.socket.emit("votar", this.nick, this.codigo, sospechoso);
    }
    this.obtenerEncargo = function () {
        this.socket.emit("obtenerEncargo", this.nick, this.codigo,)
    }
    this.atacar = function (inocente) {
        this.socket.emit("atacar", this.nick, this.codigo, inocente)
    }
    this.listaJugadores = function (codigo) {
        this.socket.emit("listaJugadores", this.codigo)
    }
    this.estoyDentro = function () {
        this.socket.emit("estoyDentro", this.nick, this.codigo);
    }
    this.movimiento = function (direccion, x, y) {
        if (this.estado != "muerto") {
            this.socket.emit("movimiento", this.nick, this.codigo, this.numJugador, direccion, x, y);
        } else {
            this.socket.emit("movimientoMuerto", this.nick, this.numJugador);
        }
    }
    this.realizarTarea = function () {
        this.socket.emit("realizarTarea", this.nick, this.codigo);
    }
    this.resetear = function () {
        this.socket.emit("resetear");
    }
    this.puedeIniciarPartida = function () {
        this.socket.emit("puedeIniciarPartida", this.nick, this.codigo)//,nick,codigo);//{"nick":nick, "codigo":codigo}
    }
    this.abandonarPartida = function () {
        this.socket.emit("abandonarPartida", this.nick, this.codigo)//,nick,codigo);//{"nick":nick, "codigo":codigo}
    }
    this.fase = function () {
        this.socket.emit("fase", this.nick, this.codigo)
    }

    this.ini = function () {
        this.socket = io.connect();
        this.lanzarSocketSrv();
    }
    this.lanzarSocketSrv = function () {
        var cli = this;
        this.socket.on('connect', function () {
            console.log("conectado al servidor de Ws");
        });
        this.socket.on('partidaCreada', function (data) {
            cli.codigo = data.codigo;
            console.log(data);
            if (data.codigo != "fallo") {
                cli.owner = true;
                cli.numJugador = 0;
                cli.estado = "vivo"
                cw.mostrarEsperandoRival();
                cw.mostrarCodigo(data.codigo);
                cw.mostrarIniciarPartida();
                ws.listaJugadores();

            }
        });
        this.socket.on('teHasUnido', function (data) {
            cli.codigo = data.codigo;
            cli.nick = data.nick;
            console.log(data);
            cw.mostrarEsperandoRival();
            cw.mostrarCodigo(data.codigo);
            cli.estado = "vivo"
            cli.numJugador = data.numJugador;
            ws.listaJugadores();

        });
        this.socket.on('nuevoJugador', function (nick) {
            console.log(nick + " se une a la partida");
        });
        this.socket.on('partidaIniciada', function (fase) {
            console.log("Partida esta en fase: " + fase);
            cli.obtenerEncargo();
            cw.limpiar();
            lanzarJuego();
            cw.mostrarAbandonarPartida();
        });
        this.socket.on('esperando', function (fase) {
            console.log('esperando: ' + fase);
        });
        this.socket.on('recibirListaPartidas', function (lista) {
            console.log(lista);
        });
        this.socket.on('fase', function (fase) {
            console.log(fase);
        });
        this.socket.on('recibirListaPartidasDisponibles', function (lista) {
            console.log(lista);
            if (!cli.codigo) {
                cw.mostrarUnirAPartida(lista);
            }
        });
        this.socket.on('votacionLanzada', function (lista) {
            console.log(lista);
            cw.mostrarModalVotacion(lista);
            //dibujarVotacion(lista)
        });
        this.socket.on('finalVotacion', function (data) {
            console.log(data);
            //cw.cerrarModal()
            $('#modalGeneral').modal('toggle');
            //cw.mostrarInfoVotacion
            console.log("muere " + data.elegido);
            if (cli.nick == data.elegido) {
                cli.estado = "muerto"
            }
            dibujarMuereInocente(data.elegido)
            cw.mostrarModalSimple(data.elegido);


        });
        this.socket.on('haVotado', function (data) {
            console.log(data);
        });
        this.socket.on('esperandoAlResto', function (data) {
            console.log(data);
            cw.mostrarEsperandoVotacion();
        });
        this.socket.on('encargo', function (data) {
            console.log(data);
            cli.impostor = data.impostor;
            cli.encargo = data.encargo;
            if (data.impostor) {
                cw.mostrarModalSimple('Impostor');
                //$('#avisarImpostor').modal("show");
            }
            if (data.impostor == false) {
                cw.mostrarModalSimple('Ciudadano');
            }
            cw.mostrarDatosJugador(data)

        });
        this.socket.on('atacado', function (data) {
            console.log(data);
        });
        this.socket.on('muereInocente', function (inocente) {
            console.log("muere " + inocente);
            if (cli.nick == inocente) {
                cli.estado = "muerto"
            }
            dibujarMuereInocente(inocente)
        });
        this.socket.on('recibirListaJugadores', function (lista) {
            console.log(lista);
            cw.mostrarListaJugadores(lista);
        });
        this.socket.on('dibujarRemoto', function (lista) {
            console.log(lista);
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].nick != cli.nick) {
                    lanzarJugadorRemoto(lista[i].nick, lista[i].numJugador);
                }
            }
            crearColision();
        });

        this.socket.on("mover", function (datos) {

            moverRemoto(datos.nick, datos.numJugador, datos.x, datos.y);

        })

        this.socket.on("moverRemoto", function (datos) {
            if (cli.estado != "muerto") {
                mover(datos.direccion, datos.nick, datos.numJugador, datos.x, datos.y);
            }
        });
        this.socket.on("moverMuerto", function (datos) {
            lanzarJugadorMuerto(datos.nick, datos.numJugador)

        });

        this.socket.on("tareaRealizada", function (data) {
            console.log(data);
            cw.mostrarDatosJugador(data)
        });
        this.socket.on("informacionGlobal", function (data) {
            console.log(data);
            cw.mostrarInformacionGlobal(data)
        });

        this.socket.on("hasAtacado", function (fase) {
            if (fase != "final") {
                ataqueOn = true;
            }
        });

        this.socket.on("final", function (data) {
            console.log(data);
            cw.mostrarModalFinal(data)
        });

        this.socket.on("aviso", function (msg) {
            console.log(msg);
            cw.mostrarModalSimple(msg)
        });

        this.socket.on("reset", function (lista) {
            cw.limpiarTodo()
            cw.mostrarNick();
            cw.mostrarCrearPartida(4);
            cw.mostrarUnirAPartida(lista);
        });

        this.socket.on("abandono", function (data) {
            console.log("abandona " + data);
            if (cli.nick == data.nick) {
                cli.estado = "muerto"
            }
            dibujarMuereInocente(data.nick)
        });
        this.socket.on("abandonoAlPrincipio", function (data) {
            console.log("abandona " + data);

            ws.listaJugadores();
        });

        this.socket.on("puedeIniciarPartida", function (data) {
            console.log(data);
            cw.mostrarIniciarPartida(data);
        });

        this.socket.on("hasAbandonado", function (data) {
            console.log("abandona " + data);

            cw.limpiarTodo();
            cw.mostrarAbandono();
        });
    }
    this.ini();
}

var ws2, ws3, sw4
function pruebasWS() {
    ws2 = new ClienteWS();
    ws3 = new ClienteWS();
    ws4 = new ClienteWS();
    var codigo = ws.codigo;

    ws2.unirAPartida("juan2", codigo);
    ws3.unirAPartida("juan3", codigo);
    ws4.unirAPartida("juan4", codigo);
}

function saltarVotos() {
    ws.saltarVotacion();
    ws4.saltarVotacion()
    ws2.saltarVotacion()
    ws3.saltarVotacion()
}

function informacion() {
    ws.obtenerEncargo();
    ws4.obtenerEncargo()
    ws2.obtenerEncargo()
    ws3.obtenerEncargo()
}

function votar() {
    ws.votar(ws3.nick);
    ws2.votar(ws3.nick);
    ws3.votar(ws3.nick);
    ws4.votar(ws2.nick)
}