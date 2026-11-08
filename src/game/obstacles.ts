import Phaser from "phaser";
import {randomTrueFalse} from "./utils.ts";

export function createObstacles(scene: Phaser.Scene, bornPos: number, bornPosForAir: number, getSpeed: () => number) {

    const cactusGroup = scene.physics.add.group()
    const ravenGroup = scene.physics.add.group()

    function createCactus(bornPos: number):void {
        const cactus = scene.add.image(scene.scale.width, bornPos, 'cactus')

        cactus.setOrigin(0.5, 1)
        cactus.setScale(Phaser.Math.FloatBetween(0.5, 1))
        cactusGroup.add(cactus)
        const cactusBody = cactus.body as Phaser.Physics.Arcade.Body
        cactusBody.setAllowGravity(false)
        cactusBody.setVelocityX(-getSpeed())
    }

    function createCactusGroup() {
        scene.time.addEvent({
            delay: 180,
            callback: () => {
                createCactus(bornPos)
            },
            repeat: Phaser.Math.Between(2, 4),
        })
    }

    function createRaven(bornPosForAir: number):void {
        if (!scene.anims.exists('raven-fly')) {
            scene.anims.create({
                key: 'raven-fly',
                frames: scene.anims.generateFrameNumbers('raven', {
                    start: 0,
                    end: 7
                }),
                frameRate: 10,
                repeat: -1
            })
        }

        const raven = scene.add.sprite(scene.scale.width, bornPosForAir, 'raven', 0)
        raven.play('raven-fly', true)
        raven.setOrigin(0.5, 0.5)
        ravenGroup.add(raven)
        const ravenBody = raven.body as Phaser.Physics.Arcade.Body
        ravenBody.setSize(50, 35)
        ravenBody.setAllowGravity(false)
        ravenBody.setVelocityX(-getSpeed() - 50)
    }

    function removeOffscreenObstacles() :void {
        [cactusGroup, ravenGroup].forEach((group) => {
            group.getChildren().forEach((child) => {
                const obstacle = child as
                    | Phaser.GameObjects.Image
                    | Phaser.GameObjects.Sprite
                    | Phaser.GameObjects.Rectangle

                if (obstacle.getBounds().right < 0) {
                    obstacle.destroy()
                }
            })
        })
    }

    /*const objectsGenerator = () => {
        const variant = Phaser.Math.Between(0, 1)

        switch (variant) {
            case 0:
                createCactusGroup()
                break
            case 1:
                createRaven(bornPosForAir)
                break
            /!*case 2:
                createSnake(bornPos)
                break*!/
        }

        scene.time.delayedCall(
            Phaser.Math.Between(2550, 3000),
            objectsGenerator
        )
    }*/

    let ravenWasShown = false


    function spawnBetweenCactuses(): void {
        const variant = Phaser.Math.Between(0, 1)

        switch (variant) {
            case 0:
                ravenWasShown = true
                break
            case 1:
                if (ravenWasShown) {
                    ravenWasShown = false
                    break
                }
                createRaven(bornPosForAir)
                ravenWasShown = true
                break
            /*case 2:
                createSnake(bornPos)
                break*/
        }
    }

    const objectsGenerator = () => {
        if (randomTrueFalse({negativeChance: 0, positiveChance: 5})) createCactusGroup()

        scene.time.delayedCall(
            1500,
            spawnBetweenCactuses)

        scene.time.delayedCall(
            Phaser.Math.Between(3500, 5000),
            objectsGenerator
        )
    }

    return { cactusGroup, ravenGroup, removeOffscreenObstacles, objectsGenerator }
}