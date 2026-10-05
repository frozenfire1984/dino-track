import Phaser from 'phaser'
import {GameScene} from "./scenes/GameScene.ts"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scene: GameScene
}

new Phaser.Game(config)