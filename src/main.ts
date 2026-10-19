import Phaser from 'phaser'
import {GameScene} from "./scenes/GameScene.ts"
//import {GameSceneCatchMoney as GameScene} from "./scenes/GameSceneCatchMoney.ts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    //width: 800,
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
            debug: true,
        },
    },
}

new Phaser.Game(config)