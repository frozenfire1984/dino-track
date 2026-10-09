import Phaser from 'phaser'

export class GameSceneCatchMoney extends Phaser.Scene {

    // Objects
    private player!: Phaser.GameObjects.Image
    private ground!: Phaser.GameObjects.Rectangle
    private groundAir!: Phaser.GameObjects.Rectangle
    private bomba!: Phaser.GameObjects.Arc
    private ballGroup!: Phaser.Physics.Arcade.Group
    private scoreBox!: Phaser.GameObjects.Text
    private gameStatusBox!: Phaser.GameObjects.Text

    // variables
    private scoreWord = "Score:"
    private scoreInt = 0


    private jump():void {
        const body = this.player.body as Phaser.Physics.Arcade.Body

        if (body.blocked.down) {
            body.setVelocityY(-400)
        }
    }

    private stepForvard():void {
        const body = this.player.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(100)

        if(this.player.flipX) {
            this.player.setFlipX(false)
        }
    }

    private stepBack():void {
        const body = this.player.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(-100)

        if(!this.player.flipX) {
            this.player.setFlipX(true)
        }
    }

    private stepStop():void {
        const body = this.player.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(0)
    }

    private scoreIncreace():void {
        console.log("AM")
        this.scoreInt += 1
        this.scoreBox.setText(`${this.scoreWord} ${this.scoreInt}`)
    }

    private gameOver():void {
        this.physics.pause()
        this.gameStatusBox.setText("Game over!")
    }

    preload() {
        this.load.image('dino', '/assets/dino.png')
    }

    create() {
        const groundHeight = 50
        const bornPos = this.scale.height - groundHeight

        //region: ground
        this.ground = this.add.rectangle(0, this.scale.height - groundHeight, this.scale.width, groundHeight,0x00ff00)
        this.ground.setOrigin(0, 0)
        this.physics.add.existing(this.ground, true)

        const groundAirHeight = 30
        this.groundAir = this.add.rectangle(500, 300, 500, groundAirHeight,0x00ff00)
        this.groundAir.setOrigin(0, 0)
        this.physics.add.existing(this.groundAir, true)
        //endregion

        //region: bomba
        const bombaR = 30
        this.bomba = this.add.arc(600, 0, bombaR,0, 360, false, 0x000000)
        //this.bomba.setOrigin(0, 0)
        this.physics.add.existing(this.bomba)

        //region: balls
        this.ballGroup = this.physics.add.group()

        for (let i = 0; i < 10; i++) {
            const ball = this.add.circle(
                300 + i * 70,
                100,
                10,
                0xff0000
            )

            const ball2 = this.add.circle(
                500 + i * 70,
                300,
                10,
                0xff0000
            )

            this.physics.add.existing(ball)
            this.physics.add.existing(ball2)
            this.ballGroup.add(ball)
            this.ballGroup.add(ball2)
        }
        //endregion

        //region: scoreBox
        this.scoreBox = this.add.text(300, 100, `${this.scoreWord} ${this.scoreInt}`, {
            fontSize: '32px',
            color: '#000000',
            fontFamily: 'Arial'
        })
        this.scoreBox.setOrigin(0, 0)
        this.scoreBox.setPosition(10, 10)
        //endregion

        //region: gameStatusBox
        this.gameStatusBox = this.add.text(300, 100, 'game continue', {
            fontSize: '32px',
            color: '#000000',
            fontFamily: 'Arial'
        })
        this.gameStatusBox.setOrigin(0, 0)
        this.gameStatusBox.setPosition(500, 10)
        //endregion

        //region: dino
        const dinoW = 70
        const dinoH = 56
        this.player = this.add.image(50, bornPos - dinoH, 'dino')

        this.player.setOrigin(0, 0)
        this.physics.add.existing(this.player)
        //const playerBody= this.player.body as Phaser.Physics.Arcade.Body
        //endregion


        //region: colliders
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.player, this.groundAir)
        this.physics.add.collider(this.bomba, this.groundAir)
        this.physics.add.collider(this.ballGroup, this.ground)
        this.physics.add.collider(this.ballGroup, this.groundAir)
        //endregion

        this.physics.add.overlap(this.player, this.ballGroup, (_player, ball) => {
            this.scoreIncreace()
            ball.destroy()
        })

        this.physics.add.overlap(this.player, this.bomba, () => {
            this.bomba.setScale(1.1)
            this.bomba.setFillStyle(0xff0000)

            this.tweens.add({
                targets: this.bomba,
                scale: 3,
                fillStyle: 0xff0000,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.bomba.destroy()
                }
            })

            this.tweens.add({
                targets: this.player,
                y: 0,
                duration: 400,
                onComplete: () => {
                    this.player.destroy()
                }
            })

            this.gameOver()
        })

        this.input.keyboard?.on('keydown-RIGHT', () => {
            this.stepForvard()
        })

        this.input.keyboard?.on('keyup-RIGHT', () => {
            this.stepStop()
        })

        this.input.keyboard?.on('keydown-LEFT', () => {
            this.stepBack()
        })

        this.input.keyboard?.on('keyup-LEFT', () => {
            this.stepStop()
        })


        /*this.input.on('pointerdown', () => {
            this.jump()
        })*/

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.jump()
        })
    }
}