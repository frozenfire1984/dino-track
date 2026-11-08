import Phaser from "phaser";

export function formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface chanceArgs {
    negativeChance?: number | undefined,
    positiveChance?: number | undefined
}

export function randomTrueFalse({negativeChance = 0, positiveChance = 1}: chanceArgs = {} as chanceArgs):boolean {
    const cast = Phaser.Math.Between(negativeChance, positiveChance)
    console.log(cast)
    return cast >= 1;
}