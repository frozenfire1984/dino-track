import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Image
    private ground!: Phaser.GameObjects.Rectangle
    private cactusGroup!: Phaser.Physics.Arcade.Group
    private gameStatusBox!: Phaser.GameObjects.Text
    private groundVisual!: Phaser.GameObjects.TileSprite

    private speedText!: Phaser.GameObjects.Text
    private timerText!: Phaser.GameObjects.Text
    private elapsedTime = 0

    private speed = 200
    private isGameOver = false

    private isPaused = false
    private pauseButtonText!: Phaser.GameObjects.Text

    private gameOver():void {
        this.isGameOver = true
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

    private togglePause(): void {
        if (this.isGameOver) return

        this.isPaused = !this.isPaused

        if (this.isPaused) {
            this.physics.pause()
            this.time.paused = true
            this.pauseButtonText.setText("Continue")
            this.gameStatusBox.setText("Game paused")
        } else {
            this.physics.resume()
            this.time.paused = false
            this.pauseButtonText.setText("Pause")
            this.gameStatusBox.setText("Game continue")
        }
    }

    private createCactus(bornPos: number):void {
        const cactus = this.add.image(this.scale.width, bornPos, 'cactus')

        cactus.setOrigin(0.5, 1)
        cactus.setScale(Phaser.Math.FloatBetween(0.5, 1))

        this.cactusGroup.add(cactus)
        const cactusBody = cactus.body as Phaser.Physics.Arcade.Body
        cactusBody.setAllowGravity(false)
        cactusBody.setVelocityX(this.speed * -1)
    }

    private jump() {
        const body = this.player.body as Phaser.Physics.Arcade.Body

        if (body.blocked.down) {
            body.setVelocityY(-700)
        }
    }

    preload() {
        this.load.image('dino', '/assets/dino.png')
        this.load.image('cactus', '/assets/cactus.png')
    }

    create() {
        this.isGameOver = false
        this.time.paused = false
        this.speed = 200
        this.isPaused = false

        const groundHeight = 50
        const bornPos = this.scale.height - groundHeight

        //region ground
        this.ground = this.add.rectangle(
            0,
            this.scale.height - groundHeight,
            this.scale.width,
            groundHeight,
            0x00ff00
        )
        this.ground.setOrigin(0, 0)
        this.physics.add.existing(this.ground, true)
        this.ground.setVisible(false)


        const graphics = this.make.graphics({ x: 0, y: 0 })

        graphics.fillStyle(0xF4D35E)
        graphics.fillRect(0, 0, 128, 50)

        graphics.fillStyle(0xC28E42)
        graphics.fillRect(15, 10, 20, 3)
        graphics.fillRect(65, 30, 15, 3)
        graphics.fillRect(105, 15, 10, 3)

        graphics.generateTexture('groundTexture', 128, 50)
        graphics.destroy()

        this.groundVisual = this.add.tileSprite(
            0,
            this.scale.height - groundHeight,
            this.scale.width,
            groundHeight,
            'groundTexture'
        )

        this.groundVisual.setOrigin(0, 0)
        //endregion

        //region cactusGroup
        this.cactusGroup = this.physics.add.group()

        const spawnCactus = () => {
            this.time.addEvent({
                delay: 180,
                callback: () => {
                    this.createCactus(bornPos)
                },
                repeat: Phaser.Math.Between(2, 4),
            })

            this.time.delayedCall(
                Phaser.Math.Between(5100, 6000),
                spawnCactus
            )
        }

        spawnCactus()
        //endregion

        //region gameStatusBox
        this.gameStatusBox = this.add.text(300, 100, 'Game continue', {
            fontSize: '32px',
            color: '#000000',
            fontFamily: 'Arial',
        })

        const maxWidth = this.gameStatusBox.width
        this.gameStatusBox.setFixedSize(maxWidth, 40)
        this.gameStatusBox.setAlign('center')
        this.gameStatusBox.setOrigin(0, 0)
        this.gameStatusBox.setPosition(500, 10)
        //endregion


        //region timerText
        this.elapsedTime = 0

        this.timerText = this.add.text(10, 10, '00:00', {
            fontSize: '24px',
            color: '#000000'
        })

        this.speedText = this.add.text(150, 10, this.speed.toString(), {
            fontSize: '24px',
            color: '#000000'
        })
        //endregion

        //region dino
        this.player = this.add.image(100, bornPos, 'dino')
        this.player.setOrigin(0.5, 1)
        this.physics.add.existing(this.player)
        //endregion

        //region collider
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.cactusGroup, this.ground)
        //endregion

        this.physics.add.overlap(this.player, this.cactusGroup, () => {
            if (this.isGameOver) return
            this.isGameOver = true

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

        this.time.addEvent({
            delay: 10000,
            callback: () => {

                if (this.speed >= 250) return

                this.speed += 10
                this.speedText.setText(this.speed.toString())

                this.cactusGroup.getChildren().forEach((cactus) => {
                    const body = cactus.body as Phaser.Physics.Arcade.Body
                    body.setVelocityX(-this.speed)
                })
            },
            loop: true
        })

        this.input.keyboard?.on('keydown-P', () => {
            this.togglePause()
        })


        //region pauseButton
        const pauseButtonBg = this.add.rectangle(0, 0, 120, 40, 0xff0000)

        this.pauseButtonText = this.add.text(0, 0, 'Pause', {
            fontSize: '20px',
            color: '#ffffff'
        })

        this.pauseButtonText.setOrigin(0.5)

        const pauseButton = this.add.container(this.scale.width - 120, 30, [
            pauseButtonBg,
            this.pauseButtonText
        ])

        pauseButton.setSize(120, 40)
        pauseButton.setInteractive()

        pauseButton.on('pointerdown', (
            _pointer: Phaser.Input.Pointer,
            _localX: number,
            _localY: number,
            event: Phaser.Types.Input.EventData
        ) => {
            event.stopPropagation()
            this.togglePause()
        })
        //endregion

    }

    update(time: number, delta: number) {
        if (this.isGameOver || this.isPaused) return
        this.groundVisual.tilePositionX += this.speed * (delta / 1000)


        this.elapsedTime += delta

        const totalSeconds = Math.floor(this.elapsedTime / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        this.timerText.setText(
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )


    }
}