// Inicialize o objeto Phaser Game e defina o tamanho padrão da janela do jogo
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})

// Declarar variáveis ​​compartilhadas na parte superior para que todos os métodos possam acessá-las
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player

function preload() {
  // Carrega e define nossos recursos de jogo
  game.load.image('sky', './assets/sky.png')
  game.load.image('ground', './assets/platform.png')
  game.load.image('diamond', './assets/diamond.png')
  game.load.spritesheet('woof', './assets/woof.png', 32, 32)
}

function create() {
  // Vamos usar a física, então habilite o sistema Arcade Physics
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Um fundo simples para o nosso jogo
  game.add.sprite(0, 0, 'sky')

  // O grupo de plataformas contém o terreno e as 2 bordas em que podemos pular
  platforms = game.add.group()


  // Vamos habilitar a física para qualquer objeto criado neste grupo
  platforms.enableBody = true


  // Vamos habilitar a física para qualquer objeto criado neste grupo
  const ground = platforms.create(0, game.world.height - 64, 'ground')

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2)

  // Isso impede que ele desapareça quando você pula nele
  ground.body.immovable = true

  // Agora vamos criar duas bordas
  let ledge = platforms.create(400, 450, 'ground')
  ledge.body.immovable = true

  ledge = platforms.create(-75, 350, 'ground')
  ledge.body.immovable = true

  // O player e suas configurações
  player = game.add.sprite(32, game.world.height - 150, 'woof')

  // Precisamos habilitar a física no player
  game.physics.arcade.enable(player)

  // Propriedades físicas do jogador. Dê um pequeno empurrão no rapaz.
  player.body.bounce.y = 0.2
  player.body.gravity.y = 800
  player.body.collideWorldBounds = true

  // Nossas duas animações, andando para a esquerda e para a direita.
  player.animations.add('left', [0, 1], 10, true)
  player.animations.add('right', [2, 3], 10, true)

  // Finalmente alguns diamantes para coletar
  diamonds = game.add.group()

  // Habilite a física para qualquer objeto criado neste grupo
  diamonds.enableBody = true

  // Crie 12 diamantes uniformemente espaçados
  for (var i = 0; i < 12; i++) {
    const diamond = diamonds.create(i * 70, 0, 'diamond')

    // Solte-os do céu e salte um pouco
    diamond.body.gravity.y = 1000
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2
  }

  // Crie o texto da pontuação
  scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

  // E inicializa nossos controles
  cursors = game.input.keyboard.createCursorKeys()
}

function update() {
  // Queremos que o player pare quando não estiver em movimento
  player.body.velocity.x = 0

  // Configurar colisões para o jogador, diamantes e nossas plataformas
  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(diamonds, platforms)

  // Chame callectionDiamond () se o jogador for sobrepuser a um diamante
  game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

  // Configure os controles!
  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.animations.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('right')
  } else {
    // Se nenhuma tecla de movimento for pressionada, pare o player
    player.animations.stop()
  }

  // Isso permite que o jogador pule!
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -400
  }
  // Mostra um modal de alerta quando a pontuação atinge 120
  if (score === 120) {
    alert('Você ganhou! =)')
    score = 0
  }
}

function collectDiamond(player, diamond) {
  // Remove o diamante da tela
  diamond.kill()

  // E atualize a pontuação
  score += 10
  scoreText.text = 'Score: ' + score
}


