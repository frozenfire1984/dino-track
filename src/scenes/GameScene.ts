import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    private rect1!: Phaser.GameObjects.Rectangle

    private rect1_width!: number
    private rect1_height!: number

    create() {
        this.rect1_width = 100
        this.rect1_height = 100

        this.rect1 = this.add.rectangle(50, 50, this.rect1_width, this.rect1_height, 0xff0000, 0.5)
        this.rect1.setOrigin(0, 0)
    }

    update(time: number, delta: number) {
        const speed = 100

        if (this.rect1.x < this.scale.width - this.rect1.width) {
            this.rect1.x += speed * (delta / 1000)

            if (this.rect1.x > this.scale.width - this.rect1.width) {
                this.rect1.x = this.scale.width - this.rect1.width
            }
        }
    }
}