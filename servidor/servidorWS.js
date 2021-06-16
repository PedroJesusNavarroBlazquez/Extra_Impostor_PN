var modelo=require("./modelo.js");

function ServidorWS(){
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
	this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
    this.enviarGlobal=function(socket,mens,data){
    	socket.broadcast.emit(mens,data);
    }

    this.lanzarSocketSrv=function(io, juego){
        var cli=this;
        io.on('connection',function(socket){		    
            socket.on('crearPartida', function(nick,numero) {
                
               // var usr=new modelo.Usuario(nick);
                var codigo=juego.crearPartida(numero,nick);	
                socket.join(codigo);	      
                console.log('usuario nick: '+nick+" crea partida codigo: "+codigo);  				
                cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo, "nick":nick});	
                var lista=juego.listaPartidasDisponibles();
                cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", lista)
                //enviar a todos lo clientes la lista de partidas		        		        
            });
            socket.on('unirAPartida', function(nick, codigo) {
                //console.log('usuario nick: '+nick+" crea partida numero: "+numero);
                //var usr=new modelo.Usuario(nick);
                var res=juego.unirAPartida(codigo, nick);	
                socket.join(codigo);
                //var owner=juego.partidas[codigo].nickOwner;
                //var maximo=juego.partidas[codigo].maximo;
                console.log("Usuario "+res.nick+" se une a partida "+res.codigo);
                cli.enviarRemitente(socket,"teHasUnido",res);		
                cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick)	 
                var lista=juego.partidas[codigo].listaJugadores();
                cli.enviarATodos(io,codigo,"recibirListaJugadores",lista) 
                var listaP=juego.listaPartidasDisponibles();
                cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", listaP)     		        
            });
		    socket.on('iniciarPartida',function(nick,codigo){
		    	//iniciar partida ToDo
		    	//controlar si nick es el owner
                //cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
                var lista=juego.partidas[codigo].listaJugadores();
                var partida=juego.partidas[codigo];
                var fase=juego.partidas[codigo].fase.nombre;
                juego.iniciarPartida(nick,codigo);
                var partida=juego.partidas[codigo];
                var fase=juego.partidas[codigo].fase.nombre;
                if(fase=="jugando"){
                    cli.enviarATodos(io, codigo, "partidaIniciada",fase);
                    var listaP=juego.listaPartidasDisponibles();
                    cli.enviarGlobal(socket, "recibirListaPartidasDisponibles", listaP) 
                    var global = partida.obtenerPorcentajeGlobal(nick);
                    var numImpostores=partida.numeroImpostoresVivos();
                    var numCiudadanos=partida.numeroCiudadanosVivos();
                    console.log(numCiudadanos+" "+numImpostores)
                    cli.enviarATodos(io,codigo,"informacionGlobal",{"global":global, "numImpostores":numImpostores, "numCiudadanos":numCiudadanos, "fase":fase})
                }else{
                    cli.enviarRemitente(socket,"esperando",fase)
            }
		    	
            });
            socket.on('puedeIniciarPartida',function(nick,codigo){
		    	//iniciar partida ToDo
		    	//controlar si nick es el owner
                //cli.enviarATodos(socket,codigo,"partidaIniciada",fase);
                var lista=juego.partidas[codigo].listaJugadores();
            if(lista.length<4){
                cli.enviarRemitente(socket,"aviso","NO HAY SUFICIENTE JUGADORES");
                cli.enviarRemitente(socket,"puedeIniciarPartida",false)
            }else{
                cli.enviarRemitente(socket,"puedeIniciarPartida",true)
            }
        });
            socket.on('listaPartidas', function() {
                var lista=juego.listaPartidas();
                cli.enviarRemitente(socket,"recibirListaPartidas",lista)
            });
            socket.on('listaPartidasDisponibles', function() {
                var lista=juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket,"recibirListaPartidasDisponibles",lista)
            });
            socket.on('lanzarVotacion', function(nick,codigo) {
                juego.lanzarVotacion(nick,codigo);
                var fase=juego.partidas[codigo].fase.nombre;
                var lista=juego.partidas[codigo].obtenerListaJugadoresVivos();
                cli.enviarATodos(io,codigo,"votacionLanzada",lista)
            });

            socket.on('saltarVotacion', function(nick,codigo) {
                var partida=juego.partidas[codigo];
                juego.saltarVoto(nick,codigo);
                if(partida.todosHanVotado()){
                    // enviar el mas votado
                    var data={"elegido":partida.elegido, "fase":partida.fase.nombre}
                    cli.enviarATodos(io,codigo,"finalVotacion",data)
                }else{
                    var data=partida.listaHanVotado();
                    cli.enviarATodos(io,codigo,"haVotado",data)
                    cli.enviarRemitente(socket,"esperandoAlResto",data)
                    //enviar lista de los que han votado
                }
            });

            socket.on('votar', function(nick,codigo,sospechoso) {
                var partida=juego.partidas[codigo];
                var fase=partida.fase.nombre;
                juego.votar(nick,codigo,sospechoso);
                console.log("1" + partida.todosHanVotado())
                if(partida.todosHanVotado()){
                    // enviar el mas votado
                    var data={"elegido":partida.elegido, "fase":partida.fase.nombre}
                    console.log("2")
                    if(partida.fase.nombre=="final"){
                       if(partida.numeroImpostoresVivos()==0){
                            console.log(" impostores " + partida.numeroImpostoresVivos())
                            cli.enviarATodos(io,codigo,"final","ganan ciudadadanos")                  
                        }else{
                            cli.enviarATodos(io,codigo,"final","ganan impostores")
                        }
                    }else{
                        cli.enviarATodos(io,codigo,"finalVotacion",data)
                    }
                }else{
                    var data=partida.listaHanVotado();
                    cli.enviarATodos(io,codigo,"haVotado",data)
                    cli.enviarRemitente(socket,"esperandoAlResto",data)
                }
            });

            socket.on('obtenerEncargo', function(nick,codigo) {
                var partida=juego.partidas[codigo];
                var res=juego.obtenerEncargo(nick,codigo);
                var porcentaje = partida.obtenerPorcentajeTarea(nick);
                var global = partida.obtenerPorcentajeGlobal(nick);
                cli.enviarRemitente(socket,"encargo",{"impostor":res.impostor, "encargo":res.encargo, "porcentaje":porcentaje, "global":global})
            });

            socket.on('atacar', function(nick,codigo,inocente) {
                var partida=juego.partidas[codigo];
                var fase=partida.fase.nombre;
                juego.atacar(nick,codigo,inocente); 
                cli.enviarATodos(io,codigo,"muereInocente",inocente)
                cli.enviarRemitente(socket,"hasAtacado",fase)
                var global = partida.obtenerPorcentajeGlobal(nick);
                var numImpostores=partida.numeroImpostoresVivos();
                var numCiudadanos=partida.numeroCiudadanosVivos()
                cli.enviarATodos(io,codigo,"informacionGlobal",{"global":global, "numImpostores":numImpostores, "numCiudadanos":numCiudadanos, "fase":fase})

                if(fase=="final"){
                    cli.enviarATodos(io,codigo,"final","ganan impostores")
                }
                    
            });
            socket.on('listaJugadores', function(codigo) {
                var lista=juego.partidas[codigo].listaJugadores();
                cli.enviarRemitente(socket,"recibirListaJugadores",lista)
            });

		    socket.on('estoyDentro',function(nick,codigo){
		    	//var usr=juego.obtenerJugador(nick,codigo);
		  //   	var numero=juego.partidas[codigo].usuarios[nick].numJugador;
		  //   	var datos={nick:nick,numJugador:numero};
				// cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos)
                var lista=juego.partidas[codigo].obtenerListaJugadores(codigo);
				cli.enviarRemitente(socket,"dibujarRemoto",lista);
		    });

		    socket.on('movimiento',function(nick,codigo,numJugador,direccion,x,y){
                //var vivo=juego.partidas[codigo].estadoVivo(nick);
                var datos={nick:nick,numJugador:numJugador,direccion:direccion,x:x,y:y};

		    	    cli.enviarATodosMenosRemitente(socket,codigo,"moverRemoto",datos);                    

            });

            socket.on('movimientoMuerto',function(nick,numJugador){
                //var vivo=juego.partidas[codigo].estadoVivo(nick);
                var datos={nick:nick,numJugador:numJugador};
                    cli.enviarRemitente(socket,"moverMuerto",datos);                    
            });
            
            
		    socket.on('realizarTarea',function(nick,codigo){
                var partida=juego.partidas[codigo];
                juego.realizarTareas(nick,codigo)
                var fase=partida.fase.nombre;
                //var porcentaje = 7
                var res=juego.obtenerEncargo(nick,codigo);
                var porcentaje = partida.obtenerPorcentajeTarea(nick);
                var global = partida.obtenerPorcentajeGlobal(nick);
                var numImpostores=partida.numeroImpostoresVivos();
                console.log(partida.numeroImpostoresVivos()+" "+partida.numeroCiudadanosVivos())
                var numCiudadanos=partida.numeroCiudadanosVivos()
                cli.enviarRemitente(socket,"tareaRealizada",{"impostor":res.impostor, "encargo":res.encargo, "porcentaje":porcentaje, "global":global})
                cli.enviarATodos(io,codigo,"informacionGlobal",{"global":global, "numImpostores":numImpostores, "numCiudadanos":numCiudadanos, "fase":fase})
                if(fase=="final"){
                    cli.enviarATodos(io,codigo,"final","ganan ciudadadanos")
                }
            });
            
            socket.on('resetear', function() {
                var lista=juego.listaPartidasDisponibles();
                cli.enviarRemitente(socket,"reset",lista)
            });
            
            socket.on('abandonarPartida', function(nick,codigo) {
                
                juego.abandonarPartida(nick,codigo);
                cli.enviarATodos(io,codigo,"abandono",nick)
                var partida=juego.partidas[codigo];
                var fase=partida.fase.nombre;
                // juego.atacar(nick,codigo,inocente); 
                // cli.enviarATodos(io,codigo,"muereInocente",inocente)
                // cli.enviarRemitente(socket,"hasAtacado",fase)
                var global = partida.obtenerPorcentajeGlobal(nick);
                var numImpostores=partida.numeroImpostoresVivos();
                var numCiudadanos=partida.numeroCiudadanosVivos()
                cli.enviarRemitente(socket,"hasAbandonado",nick)
                cli.enviarATodos(io,codigo,{"global":global, "numImpostores":numImpostores, "numCiudadanos":numCiudadanos, "fase":fase})

                if(fase=="final"){
                    cli.enviarATodos(io,codigo,"final","ganan impostores")
                }
            });
            
        });

        



    }
}

module.exports.ServidorWS=ServidorWS;
   