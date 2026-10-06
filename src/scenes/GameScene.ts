import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Image
    private box!: Phaser.GameObjects.Rectangle
    private ground!: Phaser.GameObjects.Rectangle


    private jump() {
        const body = this.player.body as Phaser.Physics.Arcade.Body

        if (body.blocked.down) {
            body.setVelocityY(-400)
        }
    }

    preload() {
        this.load.image('dino', '/assets/dino.png')
    }

    create() {

        const groundHeight = 50
        const bornPos = this.scale.height - groundHeight

        // ground
        this.ground = this.add.rectangle(0, this.scale.height - groundHeight, this.scale.width, groundHeight,0x00ff00)
        this.ground.setOrigin(0, 0)
        this.physics.add.existing(this.ground, true)

        // box
        const boxW = 50
        const boxH = 50
        this.box = this.add.rectangle(500, bornPos - boxH, boxW, boxH, 0xff0000, 1)
        this.box.setOrigin(0, 0)
        this.physics.add.existing(this.box)
        const boxBody = this.box.body as Phaser.Physics.Arcade.Body
        boxBody.setVelocityX(-100)


        // dino
        const dinoW = 70
        const dinoH = 56
        this.player = this.add.image(50, bornPos - dinoH, 'dino')
        //this.player.setDisplaySize(70, 56)
        this.player.setOrigin(0, 0)
        this.physics.add.existing(this.player)
        const playerBody= this.player.body as Phaser.Physics.Arcade.Body
        playerBody.setVelocityX(100)


        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.box, this.ground)
        //this.physics.add.overlap(this.player, this.box)



        const playerBoxOverlap = this.physics.add.overlap(this.player, this.box, () => {
            console.log('BUM')

            const boxBody = this.box.body as Phaser.Physics.Arcade.Body
            const playerBody= this.player.body as Phaser.Physics.Arcade.Body

            boxBody.setVelocityX(0)
            playerBody.setVelocityX(0)

            playerBoxOverlap.destroy()
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