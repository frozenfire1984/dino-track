import Phaser from 'phaser'
import { createGround } from "../game/ground.ts";
import { createObstacles } from "../game/obstacles.ts";
import { createHud } from "../game/ui.ts";
import { formatTime } from "../game/utils.ts";

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Image
    private ground!: Phaser.GameObjects.Rectangle
    private cactusGroup!: Phaser.Physics.Arcade.Group
    private gameStatusBox!: Phaser.GameObjects.Text
    private groundVisual!: Phaser.GameObjects.TileSprite

    private speedText!: Phaser.GameObjects.Text
    private timerText!: Phaser.GameObjects.Text
    private elapsedTime = 0

    private readonly initialSpeed = 200
    private readonly maxSpeed = 300
    private readonly speedIncreaseInterval = 10000
    private readonly speedIncrement = 10
    private speed = this.initialSpeed

    private groundHeight = 50
    private bornPos = 0

    private isGameOver = false
    private isPaused = false
    private pauseButton!: Phaser.GameObjects.Container
    private pauseButtonText!: Phaser.GameObjects.Text

    private removeOffscreenCactuses!: () => void

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
        this.speed = this.initialSpeed
        this.isPaused = false
        this.elapsedTime = 0
        this.bornPos = this.scale.height - this.groundHeight

        // ground
        const { ground, groundVisual } = createGround(this, this.groundHeight)
        this.ground = ground
        this.groundVisual = groundVisual

        // cactusGroup
        const { cactusGroup, removeOffscreenCactuses } = createObstacles(this, this.bornPos,  () => this.speed)
        this.cactusGroup = cactusGroup
        this.removeOffscreenCactuses = removeOffscreenCactuses


        // gameStatusBox
        const { gameStatusBox, pauseButton, pauseButtonText, timerText, speedText } = createHud(this, () => this.speed)
        this.gameStatusBox = gameStatusBox
        this.pauseButton = pauseButton
        this.pauseButtonText = pauseButtonText
        this.timerText = timerText
        this.speedText = speedText
        //region timerText

        //region dino
        this.player = this.add.image(100, this.bornPos, 'dino')
        this.player.setOrigin(0.5, 1)
        this.physics.add.existing(this.player)
        //endregion

        //region collider
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.cactusGroup, this.ground)

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
            delay: this.speedIncreaseInterval,
            callback: () => {

                if (this.speed >= this.maxSpeed) return

                this.speed = Math.min(this.speed + this.speedIncrement, this.maxSpeed)
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
        //endregion

        //region pauseButton
        this.pauseButton.on('pointerdown', (
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

    update(_time: number, delta: number) {
        if (this.isGameOver || this.isPaused) return
        this.groundVisual.tilePositionX += this.speed * (delta / 1000)

        this.elapsedTime += delta
        this.timerText.setText(formatTime(this.elapsedTime))

        this.removeOffscreenCactuses()
    }
}