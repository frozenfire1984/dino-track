export function createHud(scene: Phaser.Scene, getSpeed: () => number) {

    // region gameStatusBox
    const gameStatusBox = scene.add.text(300, 100, 'Game continue', {
        fontSize: '32px',
        color: '#000000',
        fontFamily: 'Arial',
    })

    const maxWidth = gameStatusBox.width
    gameStatusBox.setFixedSize(maxWidth, 40)
    gameStatusBox.setAlign('center')
    gameStatusBox.setOrigin(0, 0)
    gameStatusBox.setPosition(500, 10)
    // endregion


    // region pauseButton
    const pauseButtonBg = scene.add.rectangle(0, 0, 120, 40, 0xff0000)

    const pauseButtonText = scene.add.text(0, 0, 'Pause', {
        fontSize: '20px',
        color: '#ffffff'
    })

    pauseButtonText.setOrigin(0.5)

    const pauseButton = scene.add.container(scene.scale.width - 120, 30, [
        pauseButtonBg,
        pauseButtonText
    ])

    pauseButton.setSize(120, 40)
    pauseButton.setInteractive()
    // endregion


    const timerText = scene.add.text(10, 10, '00:00', {
        fontSize: '24px',
        color: '#000000'
    })

    const speedText = scene.add.text(150, 10, getSpeed().toString(), {
        fontSize: '24px',
        color: '#000000'
    })

    return { gameStatusBox, pauseButton, pauseButtonText, timerText, speedText }
}