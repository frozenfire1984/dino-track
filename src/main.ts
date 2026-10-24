import Phaser from 'phaser'
import {GameScene} from "./scenes/GameScene.ts"
//import {GameSceneCatchMoney as GameScene} from "./scenes/GameSceneCatchMoney.ts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 550,
    scene: GameScene,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800,
                x: 0,
            },
            //debug: true,
        },
    },
}

/*const maxWidth = 1200
const maxHeight = 550

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: Math.min(window.innerWidth, maxWidth),
    height: Math.min(window.innerHeight, maxHeight),

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: GameScene,
    backgroundColor: '#87CEEB',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            // debug: true
        }
    }
}*/

new Phaser.Game(config)