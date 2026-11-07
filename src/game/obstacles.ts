import Phaser from "phaser";

export function createObstacles(scene: Phaser.Scene, bornPos: number, getSpeed: () => number) {

    const cactusGroup = scene.physics.add.group()

    function createCactus(bornPos: number):void {
        const cactus = scene.add.image(scene.scale.width, bornPos, 'cactus')

        cactus.setOrigin(0.5, 1)
        cactus.setScale(Phaser.Math.FloatBetween(0.5, 1))
        cactusGroup.add(cactus)
        const cactusBody = cactus.body as Phaser.Physics.Arcade.Body
        cactusBody.setAllowGravity(false)
        cactusBody.setVelocityX(-getSpeed())
    }

    function removeOffscreenCactuses() :void {
        cactusGroup.getChildren().forEach((child) => {
            const cactus = child as Phaser.GameObjects.Image

            if (cactus.getBounds().right < 0) {
                cactus.destroy()
            }
        })
    }

    const spawnCactus = () => {
        scene.time.addEvent({
            delay: 180,
            callback: () => {
                createCactus(bornPos)
            },
            repeat: Phaser.Math.Between(2, 4),
        })

        scene.time.delayedCall(
            Phaser.Math.Between(5100, 6000),
            spawnCactus
        )
    }

    //spawnCactus()

    return { cactusGroup, removeOffscreenCactuses, spawnCactus }
}