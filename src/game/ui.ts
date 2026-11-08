import Phaser from "phaser";

export function createHud(scene: Phaser.Scene, getSpeed: () => number) {

    // region gameStatusBox
    const gameStatusBox = scene.add.text(300, 100, '', {
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
    const pauseButtonBg = scene.add.rectangle(0, 0, 180, 60, 0xff0000)

    const pauseButtonText = scene.add.text(0, 0, 'Пауза', {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'Arial',
    })

    pauseButtonText.setOrigin(0.5)

    const pauseButton = scene.add.container(scene.scale.width - 90, 30, [
        pauseButtonBg,
        pauseButtonText
    ])

    pauseButton.setSize(180, 60)
    pauseButton.setInteractive()
    // endregion


    // region Full Screen Button
    const fsButtonBg = scene.add.rectangle(0, 0, 220, 60, 0x0000ff)

    const fsButtonText = scene.add.text(0, 0, 'На весь экран', {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'Arial',
    })

    fsButtonText.setOrigin(0.5)

    const fsButton = scene.add.container(scene.scale.width - 290, 30, [
        fsButtonBg,
        fsButtonText
    ])

    fsButton.setSize(220, 60)
    fsButton.setInteractive()

    const onEnterFullscreen = () => fsButtonText.setText('Выйти')
    const onLeaveFullscreen = () => fsButtonText.setText('На весь экран')

    scene.scale.on('enterfullscreen', onEnterFullscreen)
    scene.scale.on('leavefullscreen', onLeaveFullscreen)

    scene.events.once('shutdown', () => {
        scene.scale.off('enterfullscreen', onEnterFullscreen)
        scene.scale.off('leavefullscreen', onLeaveFullscreen)
    })

    fsButtonText.setText(
        scene.scale.isFullscreen ? 'Выйти' : 'На весь экран'
    )

    fsButton.on('pointerdown', (event: Phaser.Types.Input.EventData) => {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen()
        } else {
            scene.scale.startFullscreen()
        }
        event.stopPropagation()
    })
    // endregion


    const timerText = scene.add.text(10, 10, '00:00', {
        fontSize: '35px',
        color: '#000000',
        fontFamily: 'Arial',
    })

    const speedText = scene.add.text(160, 10, getSpeed().toString(), {
        fontSize: '35px',
        color: '#000000',
        fontFamily: 'Arial',
    })

    return { gameStatusBox, pauseButton, pauseButtonText, timerText, speedText }
}