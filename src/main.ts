import Phaser from 'phaser'
import {GameScene} from "./scenes/GameScene.ts"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500,
            },
        },
    },
}

new Phaser.Game(config)