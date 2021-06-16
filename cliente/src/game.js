/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

function lanzarJuego() {
  game = new Phaser.Game(config);
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game;// = new Phaser.Game(config);
let cursors;
let player;
//let player2;
var jugadores = {}; //la colección de jugadores remotos
let showDebug = false;
var camera;
var worldLayer;
let map;
var crear;
var spawnPoint;
var remotos;
var muertos;
var capaTareas;
var tareasOn = true;
var ataquesOn = true;
var final = false
let recursos = [{ frame: 0, sprite: "ana" }, { frame: 3, sprite: "pepe" }, { frame: 6, sprite: "tom" }, { frame: 9, sprite: "rayo" }, { frame: 48, sprite: "antonio" }, { frame: 51, sprite: "leo" }, { frame: 54, sprite: "miguel" }, { frame: 57, sprite: "andres" }]
var spawnPoint;

function preload() {
  this.load.image("tiles", "cliente/assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "cliente/assets/tilemaps/tuxemon-town.json");

  // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
  // the player animations (walking left, walking right, etc.) in one image. For more info see:
  //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
  // If you don't use an atlas, you can do the same thing with a spritesheet, see:
  //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
  //this.load.atlas("atlas", "cliente/assets/atlas/atlas.png", "cliente/assets/atlas/atlas.json");
  this.load.spritesheet("varios","cliente/assets/images/pedro.png",{frameWidth:32,frameHeight:48});
  this.load.spritesheet("muertos","cliente/assets/images/dead.png",{frameWidth:38,frameHeight:46});
  this.load.spritesheet("abandono","cliente/assets/images/abandono.png",{frameWidth:1,frameHeight:1});
}

function create() {
  crear = this;
  map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
  capaTareas = map.createStaticLayer("capaTareas", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });
  capaTareas.setCollisionByProperty({ collides: true });
  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  /* 
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
    */
  //  player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y-50,"rojo");



  // // Watch the player and worldLayer for collisions, for the duration of the scene:
  // this.physics.add.collider(player, worldLayer);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  // const anims = this.anims;

const anims = crear.anims;
  anims.create({
    key: "ana-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 12,
      end: 14,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ana-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 24,
      end: 26,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ana-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 0,
      end: 2,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "ana-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 36,
      end: 38,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims2 = crear.anims;
  anims2.create({
    key: "pepe-left-walk",
    frames: anims.generateFrameNames("varios", {
      start: 15,
      end: 17,
    }),
    repeat: -1
  });
  anims2.create({
    key: "pepe-right-walk",
    frames: anims.generateFrameNames("varios", {
      start: 27,
      end: 29,
    }),
    repeat: -1
  });
  anims2.create({
    key: "pepe-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 3,
      end: 5,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims2.create({
    key: "pepe-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 39,
      end: 41,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims3 = crear.anims;
  anims3.create({
    key: "tom-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 18,
      end: 20,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "tom-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 30,
      end: 32,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "tom-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 6,
      end: 8,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims3.create({
    key: "tom-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 42,
      end: 44,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims4 = crear.anims;
  anims4.create({
    key: "rayo-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 21,
      end: 23,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "rayo-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 33,
      end: 35,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "rayo-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 9,
      end: 11,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims4.create({
    key: "rayo-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 45,
      end: 47,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims5 = crear.anims;
  anims5.create({
    key: "paco-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 60,
      end: 62,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "paco-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 72,
      end: 74,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "paco-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 48,
      end: 50,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims5.create({
    key: "paco-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 84,
      end: 86,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims6 = crear.anims;
  anims6.create({
    key: "antonio-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 63,
      end: 65,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "antonio-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 75,
      end: 77,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "antonio-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 51,
      end: 53,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims6.create({
    key: "antonio-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 87,
      end: 89,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims7 = crear.anims;
  anims7.create({
    key: "leo-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 66,
      end: 68,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "leo-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 78,
      end: 80,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "leo-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 54,
      end: 56,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims7.create({
    key: "leo-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 90,
      end: 92,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });

  const anims8 = crear.anims;
  anims8.create({
    key: "miguel-left-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 69,
      end: 71,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "miguel-right-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 81,
      end: 83,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "miguel-front-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 57,
      end: 59,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  anims8.create({
    key: "miguel-back-walk",
    frames: anims.generateFrameNames("varios", {
      //prefix: "misa-left-walk.",
      start: 93,
      end: 95,
      //zeroPad: 3
    }),
    //frameRate: 10,
    repeat: -1
  });
  // const camera = this.cameras.main;
  // camera.startFollow(player);
  // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = crear.input.keyboard.createCursorKeys();
  remotos = crear.add.group();
  muertos = crear.add.group();
  teclaA = crear.input.keyboard.addKey('a');
  teclaV = crear.input.keyboard.addKey('v');
  teclaT = crear.input.keyboard.addKey('t');
  lanzarJugador(ws.nick, ws.numJugador);
  ws.estoyDentro();
}

function tareas(sprite, objeto) {
  if (/*ws.encargo==objeto.properties.color &&*/  teclaT.isDown) {
    //tareasOn=false;
    ws.realizarTarea();
    objeto.properties.color = "realizada"
    console.log("realizar tarea " + ws.encargo + " " + objeto.properties.color);
    cw.mostrarModalSimple(ws.encargo);
  }

}

function lanzarJugador(nick, numJugador) {
  player = crear.physics.add.sprite(spawnPoint.x + 40 * numJugador, spawnPoint.y, "varios", recursos[numJugador].frame);
  // Watch the player and worldLayer for collisions, for the duration of the scene:
  crear.physics.add.collider(player, worldLayer);
  crear.physics.add.collider(player, capaTareas, tareas, () => { return tareasOn });
  jugadores[nick] = player;
  jugadores[nick].nick = nick;
  jugadores[nick].numJugador = numJugador;
  console.log(ws.impostor)
  if (ws.impostor) {
    camera = crear.cameras.main;
  } else {
    camera = crear.cameras.main.setZoom(2);
  }
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function lanzarJugadorMuerto(nick, numJugador) {
  // player = crear.physics.add.sprite(spawnPoint.x+40*numJugador, spawnPoint.y,"rojo",recursos[numJugador].frame);    
  // // Watch the player and worldLayer for collisions, for the duration of the scene:
  crear.physics.add.collider(player, worldLayer);
  // crear.physics.add.collider(player, capaTareas,tareas,()=>{return tareasOn});
  // jugadores[nick]=player;
  // jugadores[nick].nick=nick;
  // jugadores[nick].numJugador=numJugador;
  // console.log(ws.impostor)
  camera = crear.cameras.main.setZoom(1);
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function lanzarJugadorRemoto(nick, numJugador) {
  // var frame=recursos[numJugador].frame;
  jugadores[nick] = crear.physics.add.sprite(spawnPoint.x + 40 * numJugador, spawnPoint.y, "varios", recursos[numJugador].frame);
  crear.physics.add.collider(jugadores[nick], worldLayer);
  jugadores[nick].nick = nick;
  jugadores[nick].numJugador = numJugador;
  remotos.add(jugadores[nick]);
}

function crearColision() {
  if (ws.impostor && crear) {

    crear.physics.add.overlap(player, remotos, kill, () => { return ataquesOn })
  }
}

function kill(sprite, inocente) {
  var nick = inocente.nick;
  if (teclaA.isDown) {
    ws.atacar(nick);
  }
}

/*function dibujarMuereInocente(inocente) {

  //dibujar sprite tumbado
  //meter sprite en grupo de muertos
  //crear colision
  var x = jugadores[inocente].x;
  var y = jugadores[inocente].y;
  var numJugador = jugadores[inocente].numJugador;
  var nick = jugadores[inocente].nick;
  jugadore[inocente].estaVivo() = false;
  var muerto = crear.physics.add.sprite(x, y, "muertos", recursos2[numJugador].frame);
  //jugadores[inocente].setTexture("muertos", recurso...)
  //agregar jugadores[nick] al grupo de muertos
  muertos.add(muerto);
  console.log(nick + numJugador)
  crear.physics.add.overlap(player, muertos, votacion);
}*/

function dibujarMuereInocente(inocente) {
  var x = jugadores[inocente].x;
  var y = jugadores[inocente].y;
  var numJugador = jugadores[inocente].numJugador;

  var muerto = crear.physics.add.sprite(x, y, "muertos", recursos[numJugador].frame);
  muertos.add(muerto);

  //jugadores[inocente].setTexture("muertos",recurs...)
  //agregar jugadores[inocente] al grupo muertos    

  crear.physics.add.overlap(player, muertos, votacion);
}
function votacion(sprite, muerto) {
  //comprobar si el jugador pulsa v
  //en ese lanzo votacion

  if (teclaV.isDown) {
    ws.lanzarVotacion();
  }
}

function mover(direccion, nick, numJugador, x, y) {
  var remoto = jugadores[nick];
  const speed = 175;
  //const prevVelocity = player.body.velocity.clone();
  const nombre = recursos[numJugador].sprite;

  if (remoto && !final) {
    remoto.body.setVelocity(0);
    remoto.setX(x);
    remoto.setY(y);
    remoto.body.velocity.normalize().scale(speed);
    if (direccion == "left") {
      remoto.anims.play(nombre + "-left-walk", true);
    } else if (direccion == "right") {
      remoto.anims.play(nombre + "-right-walk", true);
    } else if (direccion == "up") {
      remoto.anims.play(nombre + "-back-walk", true);
    } else if (direccion == "down") {
      remoto.anims.play(nombre + "-front-walk", true);
    } else {
      remoto.anims.stop();
    }
  }
}

// function moverRemoto(direccion,nick,numJugador)
// {
//   const speed = 175;
//   var remoto=jugadores[nick];

//   if (direccion=="left"){
//     remoto.body.setVelocityX(-speed);
//   }
// }

function finPartida() {
  final = true;
  //remoto=undefined;
  cw.mostrarModalSimple("FINAL");
}

function update(time, delta) {
  const speed = 175;
  //const prevVelocity = player.body.velocity.clone();
  var direccion = "stop";

  const nombre = recursos[ws.numJugador].sprite;

  if (!final) {

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);
    //player2.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
      player.body.setVelocityX(-speed);
      direccion = "left";
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(speed);
      direccion = "right";
    }

    // Vertical movement
    if (cursors.up.isDown) {
      player.body.setVelocityY(-speed);
      direccion = "up";
    } else if (cursors.down.isDown) {
      player.body.setVelocityY(speed);
      direccion = "down";
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
      player.anims.play(nombre + "-left-walk", true);
    } else if (cursors.right.isDown) {
      player.anims.play(nombre + "-right-walk", true);
    } else if (cursors.up.isDown) {
      player.anims.play(nombre + "-back-walk", true);
    } else if (cursors.down.isDown) {
      player.anims.play(nombre + "-front-walk", true);
    } else {
      player.anims.stop();

      //ws.movimiento(direccion,player.body.x,player.body.y);
      ws.movimiento(direccion, player.x, player.y);

      // If we were moving, pick and idle frame to use
      // if (prevVelocity.x < 0) player.setTexture("gabe", "gabe-left-walk");
      // else if (prevVelocity.x > 0) player.setTexture("gabe", "gabe-right-walk");
      // else if (prevVelocity.y < 0) player.setTexture("gabe", "gabe-back-walk");
      // else if (prevVelocity.y > 0) player.setTexture("gabe", "gabe-front-walk");
    }
  }
}