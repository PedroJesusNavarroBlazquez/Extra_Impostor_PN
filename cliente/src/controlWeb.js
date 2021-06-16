function ControlWeb($) {

    this.limpiar = function () {
        $('#mostrarNick').remove();
        $('#mUAP').remove();
        $('#mostrarCP').remove();
        $('#mostrarLJ').remove();
        $('#mostrarIP').remove();
        $('#mostrarER').remove();
    }

    this.limpiarTodo = function () {
        $('#mostrarNick').remove();
        $('#mUAP').remove();
        $('#mostrarCP').remove();
        $('#mostrarLJ').remove();
        $('#mostrarIP').remove();
        $('#mostrarER').remove();
        $("#mostrarCod").remove()
        $('#game-container').remove();
        $('#mostrarDatosJugador').remove();
        $('#cerrar').remove();
        $('#final').remove();
        $('#mostrarInformacionGlobal').remove();
        $('#btnAP').remove();

    }

    this.mostrarNick = function () {
        var cadena = '<div id=mostrarNick>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="nick">Nick:</label>';
        cadena = cadena + '<input type="text" class="form-control" id="nick">';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';
        $('#mostraNick').append(cadena);
    }


    this.mostrarCrearPartida = function (min) {
        var cadena = '<div id=mostrarCP>';
        cadena = cadena + '<div class="col text-center">';
        cadena = cadena + '<h3>CREAR PARTIDA</h3>';
        cadena = cadena + '<div class="form-group">';
        cadena = cadena + '<label for="num">Numero: </label>';
        cadena = cadena + '<input type="number" min="' + min + '" max="10" value="' + min + '" class="form-control" id="num">';
        //cadena=cadena+'<input type="number" min='+min+' max="10" value='+min+' class="form-control" id="num">';
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnCrear" class="btn btn-primary">Crear Partida</button>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#crearPartida').append(cadena);
        $('#btnCrear').on('click', function () {
            var nick = $('#nick').val();
            if (nick == "") {
                nick = "JugadorEnBlanco"
            }
            var num = $('#num').val();
            $('#mostrarCP').remove();
            $('#mostrarNick').remove();
            $('#mUAP').remove();
            ws.crearPartida(nick, num);

        });
    }
    this.mostrarAbandonarPartida = function () {
        var cj = '<div id=mostrarAP>';
        cj = cj + '</div>';
        cj = cj + '<button type="button" id="btnAP" class="btn btn-primary">Abandonar Partida</button>';
        cj = cj + '</div>';
        cj = cj + '</div>';
        $('#Abandonar').append(cj);

        $('#btnAP').on('click', function () {
            $('#mostrarNick').remove();
            $('#mUAP').remove();
            $('#mostrarCP').remove();
            $('#mostrarLJ').remove();
            $('#mostrarIP').remove();
            $('#mostrarER').remove();
            $("#mostrarCod").remove();
            ws.abandonarPartida();
        });
    }

    this.mostrarEsperandoRival = function () {
        //$('#mostrarER').remove();
        var cadena = '<div id=mostrarER>';
        cadena = cadena + '<img src="cliente/img/Waiting.jpg">';
        cadena = cadena + '</div>';
        $('#esperando').append(cadena);
    }

    this.mostrarUnirAPartida = function (lista) {
        $('#mUAP').remove();
        var cadena = '<div id="mUAP">';
        cadena = cadena + '<div class="col text-center">';
        cadena = cadena + '<h3>UNIR A PARTIDA</h3>';
        cadena = cadena + '<div class="list-group" required>';
        for (var i = 0; i < lista.length; i++) {
            var maximo = lista[i].maximo;
            var jugadores = maximo - lista[i].huecos;
            cadena = cadena + '<a href="#" value="' + lista[i].codigo + '" class="list-group-item">' + lista[i].codigo + '<span class="badge">' + jugadores + '/' + maximo + '</span> </a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnUnir" class="btn btn-primary">Unir a partida</button>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#unirAPartida').append(cadena);

        var StoreValue = [];
        $(".list-group a").click(function () {
            StoreValue = []; //clear array
            StoreValue.push($(this).attr("value")); // add text to array
        });

        $('#btnUnir').on('click', function () {
            var nick = $('#nick').val();
            if (nick == "") {
                nick = "JugadorEnBlanco"
            }
            var codigo = StoreValue[0];
            if (codigo == undefined) {
                //modal simple 
                $('#aviso').remove();
                $('#tarea').remove();
                $('#cerrar').remove();
                $('#votacion').remove();
                $('#votar').remove();
                $('#esperandVotacion').remove();
                var cadena = "<p id='aviso'>Selecciona una partida.</p>"
                $('#contenidoModal').append(cadena)
                $("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>')
                $('#modalGeneral').modal("show");
            } else {
                $('#mostrarCP').remove();
                $('#mostrarNick').remove();
                $("#mUAP").remove();
                ws.unirAPartida(nick, codigo);
            }
        });

        if (lista.length == 0) {
            $("#mUAP").remove();
        }
    }

    this.mostrarListaJugadores = function (lista, codigo) {
        $("#mostrarLJ").remove();
        console.log(lista)
        var cadena = '<div id="mostrarLJ">';
        cadena = cadena + '<h3>LISTA DE JUGADORES</h3>';
        cadena = cadena + '<div class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<a href="#" value="' + lista[i].nick + '" class="list-group-item">' + lista[i].nick + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#listaJugadores').append(cadena);
    }

    this.mostrarIniciarPartida = function (data) {
        $("#mostrarIP").remove();
        var cadena = '<div id=mostrarIP>';
        cadena = cadena + '<hr noshade="noshade" />';
        cadena = cadena + '<div class="col text-center">';
        cadena = cadena + '<button type="button" id="btnIP" class="btn btn-primary">Iniciar Partida</button>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#iniciarPartida').append(cadena);
        $('#btnIP').on('click', function () {
            ws.puedeIniciarPartida()
            if (data) {
                $('#mostrarNick').remove();
                $('#mUAP').remove();
                $('#mostrarCP').remove();
                $('#mostrarLJ').remove();
                $('#mostrarIP').remove();
                $('#mostrarER').remove();
                ws.iniciarPartida();
            }
        });
    }

    this.mostrarModalSimple = function (msg) {
        this.limpiarModal();
        var cadena = "<p id='aviso'>" + msg + "</p>"
        $('#contenidoModal').append(cadena)
        $("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>')
        $('#modalGeneral').modal("show");
    }

    this.mostrarModalFinal = function (msg) {
        this.limpiarModal();
        var cadena = "<p id='aviso'>" + msg + "</p>"
        $('#contenidoModal').append(cadena)
        $("#pie").append('<button type="button" id="final" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>')
        $('#modalGeneral').modal("show");

        $('#final').on('click', function () {
            $('#mostrarNick').remove();
            $('#mUAP').remove();
            $('#mostrarCP').remove();
            $('#mostrarLJ').remove();
            $('#mostrarIP').remove();
            $('#mostrarER').remove();
            $('#game-container').remove();
            $('#mostrarDatosJugador').remove();
            $('#mostrarInformacionGlobal').remove();
            ws.resetear();
        });
    }

    this.mostrarEsperandoVotacion = function () {
        this.limpiarModal();
        var cadena = '<div id=esperandVotacion>';
        cadena = cadena + '<img src="cliente/img/KentBeckWaiting.jpg">';
        cadena = cadena + '</div>';
        $('#contenidoModal').append(cadena)
        $('#modalGeneral').modal("show");
    }

    this.mostrarModalVotacion = function (lista) {
        this.limpiarModal();
        var cadena = '<div id="votacion"><h3>Votación</h3>';
        cadena = cadena + '<div class="input-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<div><input type="radio" name="optradio" value="' + lista[i].nick + '">' + lista[i].nick + '</div>';
            console.log("votacion" + i + " " + lista[i].nick + " " + lista[i].numJugador)
        }
        cadena = cadena + '<div><input type="radio" name="optradio" value="-1"> Saltar voto</div>';
        cadena = cadena + '</div>';

        $("#contenidoModal").append(cadena);
        $("#pie").append('<button type="button" id="votar" class="btn btn-secondary" >Votar</button>');
        $('#modalGeneral').modal("show");
        var sospechoso = undefined;
        $('.input-group input').on('change', function () {
            sospechoso = $('input[name=optradio]:checked', '.input-group').val();
        });

        $('#votar').click(function () {
            if (sospechoso == undefined) {
                cad = '<div><p id="aviso">Debes seleccionar una opcion</p></div>';
                $("#contenidoModal").append(cad);
            }
            else if (sospechoso != "-1") {
                ws.votar(sospechoso);
            }
            else {
                ws.saltarVotacion();
            }
        });
    }

    this.mostrarDatosJugador = function (data) {
        $('#mostrarDatosJugador').remove();
        var cadena = '<div id="mostrarDatosJugador">';
        cadena = cadena + '<div class="col text-center">';
        cadena = cadena + '<h3>Caracteristicas del jugador</h3>';
        cadena = cadena + '<div class="list-group">';
        if (data.impostor == true) {
            cadena = cadena + '<a class="list-group-item">Tu rol es de <b>impostor</b></a>';
            cadena = cadena + '<a class="list-group-item">Mata a los ciudadanos antes de que te descubran o terminen las tareas.</a>';
        }
        if (data.impostor == false) {

            cadena = cadena + '<a class="list-group-item">Tu rol es de ciudadano</a>';
            cadena = cadena + '<a class="list-group-item">Encuentra el token ' + data.encargo + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#datosJugador').append(cadena);
    }

    this.mostrarInformacionGlobal = function (data) {
        $('#mostrarInformacionGlobal').remove();
        var cadena = '<div id="mostrarInformacionGlobal">';
        cadena = cadena + '<div class="col text-center">';
        cadena = cadena + '<h3>Caracteristicas Generales del juego</h3>';
        cadena = cadena + '<div class="list-group">';
        cadena = cadena + '<a class="list-group-item">FASE : ' + data.fase + '</a>';
        cadena = cadena + '<a class="list-group-item">Percentaje de todas las tareas<span class="badge">' + data.global.toFixed(2) + '%</span></a>';
        cadena = cadena + '<a class="list-group-item">Impostores: ' + data.numImpostores + '</a>';
        cadena = cadena + '<a class="list-group-item">Ciudadanos: ' + data.numCiudadanos + '</a>';

        cadena = cadena + '</div>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $('#informacionGlobal').append(cadena);
    }


    this.mostrarCodigo = function (codigo) {
        $("#mostrarCod").remove();
        var cadena = '<div id="mostrarCod">';
        cadena = cadena + '<h3>PARTIDA ' + codigo + '</h3>';
        cadena = cadena + '</div>';

        $('#mostrarCodigo').append(cadena);
    }

    this.mostrarAbandono = function () {
        $("#mostrarCod").remove();
        var cadena = '<div id="mostrarCod">';
        cadena = cadena + '<h3>abandono de partida</h3>';
        cadena = cadena + '</div>';

        $('#mostrarCodigo').append(cadena);
    }

    this.limpiarModal = function () {
        $('#aviso').remove();
        $('#tarea').remove();
        $('#cerrar').remove();
        $('#votacion').remove();
        $('#votar').remove();
        $('#esperandVotacion').remove();
        $('#final').remove();

    }

}