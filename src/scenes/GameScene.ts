import Phaser from 'phaser'
import { createGround } from "../game/ground.ts";
import { createObstacles } from "../game/obstacles.ts";
import { createHud } from "../game/ui.ts";
import { formatTime } from "../game/utils.ts";

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Sprite
    private ground!: Phaser.GameObjects.Rectangle
    private cactusGroup!: Phaser.Physics.Arcade.Group
    private ravenGroup!: Phaser.Physics.Arcade.Group
    private objectsGenerator!: () => void

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

    private bornPosForAir = 0

    private readonly delayBeforeStart = 3000
    private isDelayBeforeStart = true
    private isGameOver = false
    private isPaused = false
    private pauseButton!: Phaser.GameObjects.Container
    private pauseButtonText!: Phaser.GameObjects.Text

    private removeOffscreenObstacles!: () => void

    private gameOver():void {
        this.isGameOver = true
        this.physics.pause()
        this.anims.pauseAll()
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
        if (this.isDelayBeforeStart) return
        if (this.isGameOver) return

        this.isPaused = !this.isPaused

        if (this.isPaused) {
            this.player.anims.pause()
            this.physics.pause()
            this.time.paused = true
            this.anims.pauseAll()
            this.pauseButtonText.setText("Continue")
            this.gameStatusBox.setText("Game paused")
        } else {
            this.player.anims.resume()
            this.physics.resume()
            this.time.paused = false
            this.anims.resumeAll()
            this.pauseButtonText.setText("Pause")
            this.gameStatusBox.setText("Game continue")
        }
    }

    private jump() {
        if (this.isDelayBeforeStart) return

        const dinoBody = this.player.body as Phaser.Physics.Arcade.Body

        if (dinoBody.blocked.down) {
            this.player.stop()
            dinoBody.setVelocityY(-700)
        }
    }

    preload() {
        this.load.spritesheet('dino', '/assets/dino-sprites.png', {
            frameWidth: 80,
            frameHeight: 64
        })

        this.load.spritesheet('raven', '/assets/raven-sprites.png', {
            frameWidth: 64,
            frameHeight: 64
        })

        this.load.image('cactus', '/assets/cactus.png')
    }

    create() {
        this.anims.resumeAll()
        this.isDelayBeforeStart = true
        this.isGameOver = false
        this.time.paused = false
        this.speed = this.initialSpeed
        this.isPaused = false
        this.elapsedTime = 0
        this.bornPos = this.scale.height - this.groundHeight
        this.bornPosForAir = 300

        // ground
        const { ground, groundVisual } = createGround(this, this.groundHeight)
        this.ground = ground
        this.groundVisual = groundVisual

        // cactusGroup
        const { cactusGroup, ravenGroup, removeOffscreenObstacles, objectsGenerator } = createObstacles(this, this.bornPos, this.bornPosForAir,  () => this.speed)
        this.cactusGroup = cactusGroup
        this.ravenGroup = ravenGroup
        this.removeOffscreenObstacles = removeOffscreenObstacles
        this.objectsGenerator = objectsGenerator


        // gameStatusBox
        const { gameStatusBox, pauseButton, pauseButtonText, timerText, speedText } = createHud(this, () => this.speed)
        this.gameStatusBox = gameStatusBox
        this.pauseButton = pauseButton
        this.pauseButtonText = pauseButtonText
        this.timerText = timerText
        this.speedText = speedText
        //region timerText

        //region dino
        //this.player = this.add.image(100, this.bornPos, 'dino')
        if (!this.anims.exists('dino-run')) {
            this.anims.create({
                key: 'dino-run',
                frames: this.anims.generateFrameNumbers('dino', {
                    start: 1,
                    end: 6
                }),
                frameRate: 10,
                repeat: -1
            })
        }
        this.player = this.add.sprite(100, this.bornPos, 'dino', 0)
        this.player.setOrigin(0.5, 1)
        this.physics.add.existing(this.player)

        const dinoBody = this.player.body as Phaser.Physics.Arcade.Body

        dinoBody.setSize(50, 54)
        dinoBody.setOffset(24, 10)
        dinoBody.updateFromGameObject()
        //endregion

        //region collider
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.cactusGroup, this.ground)

        this.physics.add.overlap(this.player, [this.cactusGroup, this.ravenGroup], () => {
            if (this.isGameOver) return
            this.isGameOver = true

            this.player.stop()
            this.player.setFrame(9)



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


        this.physics.pause()

        this.time.delayedCall(this.delayBeforeStart, () => {
            this.isDelayBeforeStart = false
            this.physics.resume()
            this.objectsGenerator()
            this.player.play('dino-run')

        })
    }

    update(_time: number, delta: number) {
        if (this.isDelayBeforeStart || this.isGameOver || this.isPaused) return
        this.groundVisual.tilePositionX += this.speed * (delta / 1000)

        this.elapsedTime += delta
        this.timerText.setText(formatTime(this.elapsedTime))

        this.removeOffscreenObstacles()

        const dinoBody = this.player.body as Phaser.Physics.Arcade.Body

        if (dinoBody.blocked.down) {
            this.player.play('dino-run', true)
        }  else {
            this.player.stop()

            if (dinoBody.velocity.y < 0) {
                this.player.setFrame(7)
            } else {
                this.player.setFrame(8)
            }
        }
    }
}