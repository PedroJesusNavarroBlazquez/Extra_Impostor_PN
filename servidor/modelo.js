var cad=require('./cad.js')
function Juego(min,test) {
    this.min=min;
    this.test=test;
    this.partidas = {};
    this.cad= new cad.Cad(); 
    this.crearPartida = function (num, owner) {
        let codigo="undefined";
        if(!this.partidas[codigo] && this.numValido(num)){
            codigo = this.obtenerCodigo();
            this.partidas[codigo] = new Partida(num, owner, codigo,this);
            var fase=this.partidas[codigo].fase.nombre;
            //owner.partida = this.partidas[codigo]; 
            //console.log("ENTRO_____________________"+test)
            if (test=="test"){
                //console.log("no nos conectamos " + test)
            }else{
                //console.log("ENTRO_____________________")
            this.cad.insertarPartida({"codigo":codigo, "nick":owner,"numero de jugadores":num, "fase":fase},function(res){})
            }
        }
        else{
            console.log(codigo)
        }
        return codigo;
    }
    this.unirAPartida = function (codigo, nick) {
        var res=-1;
        if (this.partidas[codigo]) {
            res=this.partidas[codigo].agregarUsuario(nick);
        }
        return res;
    }
    this.numValido=function(num){
        return (num>=this.min && num<=10)
    }
    this.obtenerCodigo = function () {
        let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letras = cadena.split('');
        let maxCadena = cadena.length;
        let codigo = [];
        for (i = 0; i < 6; i++) {
            codigo.push(letras[randomInt(1, maxCadena) - 1]);
        }
        return codigo.join('');
    }
    this.eliminarPartida=function(codigo){
        delete this.partidas[codigo];
    }
    this.listaPartidasDisponibles=function(){
        var lista=[]
        var huecos=0
        var maximo=0
        for (var key in this.partidas) {
            var partida=this.partidas[key];
            huecos=this.partidas[key].obtenerHuecos();
            maximo=partida.maximo;
            var owner=this.partidas[key].nickOwner;
            var fase=this.partidas[key].fase.nombre;
            if(huecos>0){
                if(fase!="jugando"){
                    lista.push ({"codigo":key, "huecos":huecos, "owner":owner, "maximo":maximo, "fase":fase});
                }  
            }
        }
        return lista
    }
    this.listaPartidas=function(){
        var lista=[]
        for (var key in this.partidas) {
            var owner=this.partidas[key].nickOwner;
                lista.push ({"codigo":key, "owner":owner});
            }
    
        return lista
    }
	this.iniciarPartida=function(nick,codigo){
		var owner=this.partidas[codigo].nickOwner;
		if (nick==owner){
			this.partidas[codigo].iniciarPartida();
		}
    }
    this.abandonarPartida=function(nick,codigo){
            this.partidas[codigo].abandonarPartida(nick);
	}
    
    this.lanzarVotacion=function(nick,codigo){
        var usr=this.partidas[codigo].usuarios[nick];
        usr.lanzarVotacion();
    }
    this.saltarVoto=function(nick,codigo){
		var usr=this.partidas[codigo].usuarios[nick];
		usr.saltarVoto();
	}
	this.votar=function(nick,codigo,sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partidas[codigo].obtenerUsuario(nick)
		usr.votar(sospechoso);
	}
	this.obtenerEncargo=function(nick,codigo){
		var res={};
		var encargo=this.partidas[codigo].usuarios[nick].encargo;
        var impostor=this.partidas[codigo].usuarios[nick].impostor;
        var estado=this.partidas[codigo].usuarios[nick].estado.nombre;
		res={"nick":nick,"encargo":encargo,"impostor":impostor, "estado":estado};

		return res;
    }
    this.atacar=function(nick,codigo,sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partidas[codigo].obtenerUsuario(nick)
		usr.atacar(sospechoso);
    }
    this.obtenerListaJugadores=function(codigo){
		return this.partidas[codigo].obtenerListaJugadores();
    }
    this.obtenerListaJugadoresVivos=function(codigo){
		return this.partidas[codigo].obtenerListaJugadoresVivos();
    }
    this.realizarTareas=function(nick,codigo){
        return this.partidas[codigo].realizarTareas(nick);
    }
    this.obtenerNumJugador=function(nick,codigo){
        return this.partidas[codigo].usuarios[nick].numJugador;
    }


    this.partidasCreadas=function(admin,callback){
        if(admin=="1234"){
            this.cad.obtenerPartidaCriterio({fase:"inicial"},function(lista){
                if(lista){
                   callback(lista); 
                }else{
                    callback([]); 
                }
                
            })
        }
    }

    this.partidasFinalizadas=function(admin,callback){
        if(admin=="1234"){
            this.cad.obtenerPartidaCriterio({fase:"final"},function(lista){
                if(lista){
                   callback(lista); 
                }else{
                    callback([]); 
                }
                
            })
        }
    }


    if (test=="test"){
        //console.log("no nos conectamos " + test)
    }else{
        console.log("nos conectamos " + test)
        this.cad.connect(function(db){
            console.log("conectado a Atlas");
        })
    }
}

function Partida(num, owner, codigo, juego) {
    this.maximo = num;
    this.nickOwner = owner;
    this.fase = new Inicial();
    this.codigo = codigo;
    this.juego = juego;
    this.usuarios = {};
    this.elegido="no hay nadie elegido";
    this.encargos=["rojo","verde", "amarillo", "negro"];
    this.agregarUsuario = function (nick) {
        return this.fase.agregarUsuario(nick, this);
    }
    this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida=this;			
		var numero=this.numJugadores()-1;
        this.usuarios[nuevo].numJugador=numero
		if (this.comprobarMinimo()){
            this.fase=new Completado();
            var fase=this.fase.nombre;
            if (juego.test!="test"){
                this.juego.cad.insertarPartida({"codigo":codigo, "nick":owner,"numero de jugadores":num, "fase":fase},function(res){})
            }
        }
		return {"codigo":this.codigo,"nick":nuevo,"numJugador":numero};
		//this.comprobarMinimo();		
	}
    this.obtenerHuecos=function(){
        return this.maximo - this.numJugadores();
    }   
    this.numJugadores=function(){
        return Object.keys(this.usuarios).length;
    }
    this.comprobarMinimo = function () {
        return this.numJugadores() >= 4
    }
    this.comprobarMaximo = function () {
        return this.numJugadores() < this.maximo
    }
    this.iniciarPartida = function () {
        this.fase.iniciarPartida(this);
    }
    this.puedeIniciarPartida = function(){
        this.fase = new Jugando();
        this.asignarEncargos();
        this.asignarImpostor();
    }
    this.abandonarPartida = function (nick) {
        this.fase.abandonarPartida(nick, this)
    }
    this.puedeAbandonarPartida=function(nick){
        //this.eliminarUsuario(nick);
        // if (!this.comprobarMinimo()) {
        //     this.fase = new Inicial();
        // }
        this.comprobarFinal();
        if (this.numJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
    }
    this.eliminarUsuario = function (nick) {
        delete this.usuarios[nick];
    }
    this.asignarEncargos = function (){
		let ind=0;
		for (var key in this.usuarios) {
		    this.usuarios[key].encargo=this.encargos[ind];
		    ind=(ind+1)%(this.encargos.length)
		}
    }  
    this.asignarImpostor = function (){
        let lista=Object.keys(this.usuarios);
        let aleatorio=randomInt(0,lista.length-1)
        let imp=lista[aleatorio]
        this.usuarios[imp].impostor=true;
        this.usuarios[imp].asignarImpostor();
    }
    this.atacar=function(usuario){
        this.fase.atacar(usuario,this)
    }
    this.puedeAtacar=function(usuario){
        this.usuarios[usuario].esAtacado()
        //this.comprobarFinal()
    }
    this.numeroImpostoresVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
            if (this.usuarios[key].impostor && this.usuarios[key].estadoVivo()//this.usuarios[key].estado.nombre=="vivo"
            ){
				cont++;
			}
		}
		return cont;
	}
    this.numeroCiudadanosVivos=function(){
		let cont=0;
		for (var key in this.usuarios) {
            if (this.usuarios[key].impostor == false && this.usuarios[key].estadoVivo()//.estado.nombre=="vivo"
            ){
				cont++;
			}
		}
		return cont;
	}
    this.gananImpostores = function(){
        if(this.numeroCiudadanosVivos() <= this.numeroImpostoresVivos()){
            return true
        } else{
            return false
        }
    }
    this.gananCiudadanos = function(){
        if(this.numeroImpostoresVivos()==0){
            return true
        } else{
            return false
        }
    }
    this.votar=function(sospechoso){
		this.fase.votar(sospechoso,this)
	}
	this.puedeVotar=function(sospechoso){
		this.usuarios[sospechoso].esVotado();
		this.comprobarVotacion();
    }
	this.masVotado=function(){
		let votado="no hay nadie mas votado";
		let max=1;
		for (var key in this.usuarios) {
			if (max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}
		//comprobar que solo hay 1 más votado

		return votado;
	}
    this.numeroSkip=function(){
        let cont=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && this.usuarios[key].skip==true){
				cont++;
			}
		}
		return cont;
    }
    this.todosHanVotado=function(){
		let res=true;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && !this.usuarios[key].haVotado){
				res=false;
				break;
            }
        }
            if(res == true){
                for (var key in this.usuarios) {
                    console.log(this.usuarios[key].nick + ": "+this.usuarios[key].votos);
                }
		    }
		return res;
	}
	this.listaHanVotado=function(){
		var lista=[];
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo() && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}
	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.masVotado();
			if (elegido && elegido.votos>this.numeroSkip()){
				elegido.esAtacado();
				this.elegido=elegido.nick;
			}
			this.finalVotacion();
		}
	}
	this.finalVotacion=function(){
        this.fase=new Jugando();
        this.comprobarFinal();
		//this.reiniciarContadoresVotaciones(); 

	}
	this.reiniciarContadoresVotaciones=function(){
		this.elegido="no hay nadie elegido";
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoVivo()){
				this.usuarios[key].reiniciarContadoresVotaciones();
            }else{
				this.usuarios[key].reiniciarContadoresVotacionesMuertos();
            }
		}
    }
	this.obtenerListaJugadores=function(){
		var lista=[]
		for (var key in this.usuarios){
			var numero=this.usuarios[key].numJugador;
			lista.push({nick:key,numJugador:numero});
		}
		return lista;//Object.keys(this.usuarios);
    }
    this.obtenerListaJugadoresVivos=function(){
		var lista=[]
		for (var key in this.usuarios){
            if(this.usuarios[key].estadoVivo()){
                var numero=this.usuarios[key].numJugador;
                lista.push({nick:key,numJugador:numero});
            }
		}
		return lista;//Object.keys(this.usuarios);
	}
    this.comprobarFinal=function(){
        console.log("impostores " + this.numeroImpostoresVivos() + " ciudadanos " + this.numeroCiudadanosVivos())
            if (this.gananImpostores()){
                console.log("impostores " + this.numeroImpostoresVivos())
                this.finPartida();
            }
            else if (this.gananCiudadanos()){
                console.log("cui " + this.numeroCiudadanosVivos())
                this.finPartida();
            }
    }
    this.finPartida=function(){
        console.log("partida " + this.codigo + " FINAL")
        this.fase=new Final;
        var fase=this.fase.nombre;
        if (juego.test!="test"){
         this.juego.cad.insertarPartida({"codigo":codigo, "nick":owner,"numero de jugadores":num, "fase":fase},function(res){})
        }
    }
    this.lanzarVotacion=function(){
        this.fase.lanzarVotacion(this);
    }
    this.puedeLanzarVotacion=function(){
        this.reiniciarContadoresVotaciones(); 
        this.fase=new Votacion();
    }
    this.listaJugadores=function(){
        var lista=[]
        for (var key in this.usuarios) {
            var numero=this.usuarios[key].numJugador;
                lista.push ({"nick":this.usuarios[key].nick,"numero":this.usuarios[key].numJugador});
            }
        return lista
    }
    this.realizarTareas=function(nick){
        this.fase.realizarTareas(nick,this)
    }
    this.puedeRealizarTareas=function(nick){
        this.usuarios[nick].realizarTareas();
    }
    this.tareaTerminada=function(){
        if(this.comprobarTareasTerminadas()){
            this.finPartida();
        }
    }
    this.comprobarTareasTerminadas=function(){
        let res=true;
		for (var key in this.usuarios) {
			if (this.usuarios[key].estadoTarea!="completado"){
				res=false;
				break;
			}
		}
		return res;
    }
    this.obtenerPorcentajeTarea=function(nick){
        return this.usuarios[nick].obtenerPorcentajeTarea();
    }
    this.estadoVivo=function(nick){
        return this.usuarios[nick].estadoVivo();
    }
    this.obtenerPorcentajeGlobal=function(){
        var total=0;
        for (var key in this.usuarios) {
            total = total+this.obtenerPorcentajeTarea(key);
        }
        total=total/(this.numJugadores()-1);//numero impostores
        return total;
    }
    this.agregarUsuario(owner);
}

function Inicial() {
    this.nombre = "inicial";
	this.agregarUsuario=function(nick,partida){
		return partida.puedeAgregarUsuario(nick);
		// if (partida.comprobarMinimo()){
		// 	partida.fase=new Completado();
		// }		
	}
    this.iniciarPartida = function (partida) {
        console.log("Faltan jugadores");
    }
    this.abandonarPartida = function (nick, partida) {
        partida.puedeAbandonarPartida(nick);
        //comprobar si no hay usuarios
    }
    this.atacar=function(usuario){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
    this.realizarTareas=function(nick,partida){}
}

function Completado() {
    this.nombre = "completado";
    this.iniciarPartida = function (partida) {
        //llame a puede inciar partida
        partida.puedeIniciarPartida();
        //agsinar encargos: secuencialmente a todos los usuario
        // asignar impostor: dado el array de usuario (Object.keys)


    }
    this.agregarUsuario = function (nick, partida) {
        if (partida.comprobarMaximo()) {
            return partida.puedeAgregarUsuario(nick);
        }
        else {
            console.log("Lo siento, numero máximo")
        }
    }
    this.abandonarPartida = function (nick, partida) {
        partida.eliminarUsuario(nick);
        if(!partida.comprobarMinimo()){
            partida.fase=new Inicial()
        }
        
    }
    this.atacar=function(usuario){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
    this.realizarTareas=function(nick,partida){}
}

function Jugando() {
    this.nombre = "jugando";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN JUEGO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {
        partida.usuarios[nick].esAtacado()
        partida.eliminarUsuario(nick);
        //comprobar si termina la partida
    }
    this.atacar=function(usuario,partida){
        partida.puedeAtacar(usuario)
    }
    this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
    }
    this.votar=function(sospechoso,partida){}
    this.realizarTareas=function(nick,partida){
        partida.puedeRealizarTareas(nick)
    }
}


function Votacion(){
	this.nombre="votacion";
		this.agregarUsuario=function(nick,partida){}
		this.iniciarPartida=function(partida){}
		this.abandonarPartida=function(nick,partida){}
		this.atacar=function(inocente){};
        this.lanzarVotacion=function(){}
        this.votar=function(sospechoso,partida){
            partida.puedeVotar(sospechoso);
        }
        this.realizarTareas=function(nick,partida){}
}


function Final() {
    this.nombre = "final";
    this.agregarUsuario = function (nick, partida) {
        console.log("LA PARTIDA ESTA EN ACBANDO");
    }
    this.iniciarPartida = function (partida) {//this.puedeAgregarUsuario(nick);
    }
    this.abandonarPartida = function (nick, partida) {}
    this.atacar=function(usuario,partida){}
    this.lanzarVotacion=function(){}
    this.votar=function(sospechoso,partida){}
    this.realizarTareas=function(nick,partida){}
}
function Usuario(nick) {
    this.nick = nick;
    this.numJugador;
    //this.juego = juego;
    this.partida;
    this.impostor=false;
    this.encargo="ninguno";
    this.estado=new Vivo()
    this.votos=0
    this.skip=false
    this.heVotado=false
    this.realizado=0
    this.maxTarea=1
    this.estadoTarea="no terminada"

    this.estadoVivo=function(){
        return this.estado.estadoVivo();
    }
    this.iniciarPartida = function () {
        this.partida.iniciarPartida();
    }
    this.asignarImpostor=function(){
        this.impostor=true;
        this.estadoTarea="completado"
        //this.realizado=10;
    }
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numJugadores()<=0){
			console.log(this.nick," era el último jugador");
		}
	}
    this.atacar = function(usuario){
        if (this.impostor){
            this.partida.atacar(usuario)
        }else {
            console.log("un ciudadano no puede atacar")
        }
    }
    this.esAtacado=function(){
        this.estado.esAtacado(this);
    }
	this.saltarVoto=function(){
		this.skip=true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
	}
	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
	this.votar=function(sospechoso){
		this.haVotado=true;
		this.partida.votar(sospechoso);
	}
	this.esVotado=function(){
		this.votos++;
	}
    this.reiniciarContadoresVotaciones=function(){
		this.votos=0;
		this.haVotado=false;
		this.skip=false;
    }
    this.reiniciarContadoresVotacionesMuertos=function(){
        this.votos=-1;
    }
    this.realizarTareas=function(){
        if(!this.impostor){
            if(this.realizado<this.maxTarea){
                this.realizado++
            }
            if(this.realizado>=this.maxTarea){
                this.estadoTarea="completado"
                this.partida.tareaTerminada();
            }
        }
        console.log("usuario "+this.nick+" realizar tarea "+ this.encargo+" estado tarea " + this.estadoTarea)
    }
    this.obtenerPorcentajeTarea=function(){
        return 100*(this.realizado/this.maxTarea);
    }

}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Vivo(){
    this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();
		usr.partida.comprobarFinal();
	}
    this.lanzarVotacion=function(usuario){
        usuario.puedeLanzarVotacion();
    }

    this.estadoVivo=function(){
        return true;
    }
}

function Muerto(){
    this.nombre="muerto";
    this.esAtacado=function(usuario){}
    this.lanzarVotacion=function(usuario){}  
    this.estadoVivo=function(){
        return false;
    } 
}

/*function inicio(){
    juego=new Juego();
    var usr=new Usuario("rafa");
    var codigo=juego.crearPartida(4,usr);
    if (codigo!="fallo"){
        juego.unirAPartida(codigo,"rafa");
        juego.unirAPartida(codigo,"rafa");
        juego.unirAPartida(codigo,"rafa");
        usr.iniciarPartida();
    }
}
*/

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;