import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    private rect1!: Phaser.GameObjects.Rectangle

    create() {
        const ground = this.add.rectangle(400,425,800,50,0x00ff00)
        this.physics.add.existing(ground, true)

        this.rect1 = this.add.rectangle(50, 50, 50, 50, 0xff0000, 1)
        this.rect1.setOrigin(0, 0)
        this.physics.add.existing(this.rect1)


        this.physics.add.collider(this.rect1, ground)



        this.input.on('pointerdown', () => {
            const body = this.rect1.body as Phaser.Physics.Arcade.Body


            if (body.blocked.down) {
                body.setVelocityY(-300)
            }
           
        })

    }

    update(time: number, delta: number) {
        /*const speed = 100

        if (this.rect1.x < this.scale.width - this.rect1.width) {
            this.rect1.x += speed * (delta / 1000)

            if (this.rect1.x > this.scale.width - this.rect1.width) {
                this.rect1.x = this.scale.width - this.rect1.width
            }
        }*/
    }
}