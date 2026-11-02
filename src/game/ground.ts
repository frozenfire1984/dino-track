export function createGround(scene: Phaser.Scene, groundHeight: number) {
    const ground = scene.add.rectangle(
        0,
        scene.scale.height - groundHeight,
        scene.scale.width,
        groundHeight,
        0x00ff00
    )
    ground.setOrigin(0, 0)
    scene.physics.add.existing(ground, true)
    ground.setVisible(false)


    const graphics = scene.make.graphics({ x: 0, y: 0 })

    graphics.fillStyle(0xF4D35E)
    graphics.fillRect(0, 0, 128, 50)

    graphics.fillStyle(0xC28E42)
    graphics.fillRect(15, 10, 20, 3)
    graphics.fillRect(65, 30, 15, 3)
    graphics.fillRect(105, 15, 10, 3)

    graphics.generateTexture('groundTexture', 128, 50)
    graphics.destroy()

    const groundVisual = scene.add.tileSprite(
        0,
        scene.scale.height - groundHeight,
        scene.scale.width,
        groundHeight,
        'groundTexture'
    )

    groundVisual.setOrigin(0, 0)

    return { ground, groundVisual}
}