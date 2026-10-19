import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Image
    private ground!: Phaser.GameObjects.Rectangle
    private cactusGroup!: Phaser.Physics.Arcade.Group
    private gameStatusBox!: Phaser.GameObjects.Text

    private gameOver():void {
        this.physics.pause()
        this.time.paused = true

        this.gameStatusBox.setText("Game over!")

        let timeLeft = 5;
        const countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.scene.restart()
            } else {
                this.gameStatusBox.setText(timeLeft.toString())
            }
            timeLeft--;
        }, 1000);
    }


    private createCactus(bornPos: number):void {
        const cactus = this.add.circle(
            this.scale.width,
            bornPos - 1,
            Phaser.Math.Between(10, 15),
            0xff0000
        )

        cactus.setOrigin(0.5, 1)

        this.cactusGroup.add(cactus)
        const cactusBody = cactus.body as Phaser.Physics.Arcade.Body
        cactusBody.setAllowGravity(false)
        cactusBody.setVelocityX(-300)
    }


    private jump() {
        const body = this.player.body as Phaser.Physics.Arcade.Body

        if (body.blocked.down) {
            body.setVelocityY(-600)
        }
    }

    preload() {
        this.load.image('dino', '/assets/dino.png')
    }

    create() {
        this.time.paused = false

        const groundHeight = 50
        const bornPos = this.scale.height - groundHeight

        //region ground
        this.ground = this.add.rectangle(0, this.scale.height - groundHeight, this.scale.width, groundHeight,0x00ff00)
        this.ground.setOrigin(0, 0)
        this.physics.add.existing(this.ground, true)
        //endregion

        //region cactusGroup
        this.cactusGroup = this.physics.add.group()

        const spawnCactus = () => {
            this.time.addEvent({
                delay: 200,
                callback: () => {
                    this.createCactus(bornPos)
                },
                repeat: Phaser.Math.Between(2, 4),
            })

            this.time.delayedCall(
                Phaser.Math.Between(1700, 3000),
                spawnCactus
            )
        }

        spawnCactus()
        //endregion

        //region gameStatusBox
        this.gameStatusBox = this.add.text(300, 100, 'game continue', {
            fontSize: '32px',
            color: '#000000',
            fontFamily: 'Arial'
        })
        this.gameStatusBox.setOrigin(0, 0)
        this.gameStatusBox.setPosition(500, 10)
        //endregion


        //region dino
        const dinoH = 56
        this.player = this.add.image(100, bornPos - dinoH, 'dino')
        this.player.setOrigin(0, 0)
        this.physics.add.existing(this.player)
        //endregion


        //region collider
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.cactusGroup, this.ground)
        //this.physics.add.collider(this.player, this.cactusGroup)
        //endregion

        let isGameOver = false

        this.physics.add.overlap(this.player, this.cactusGroup, (_player, cactus) => {


            if (isGameOver) return
            isGameOver = true

            // Отключаем физическое тело конкретного кактуса
            //const cactusBody = cactus.body as Phaser.Physics.Arcade.Body
            //cactusBody.enable = false

            // Останавливаем физику
            //this.physics.pause()

            // Анимация смерти динозаврика
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


        this.input.on('pointerdown', () => {
            this.jump()
        })

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.jump()
        })

    }

    update(time: number, delta: number) {

        //const speed = 100

        //this.box.x -= speed * (delta / 1000)

        /*const speed = 100

        if (this.player.x < this.scale.width - this.player.width) {
            this.player.x += speed * (delta / 1000)

            if (this.player.x > this.scale.width - this.player.width) {
                this.player.x = this.scale.width - this.player.width
            }
        }*/
    }
}