import * as progress from "progress-stream"

export class ProgressHelper {
    static barCompleteChar: string = "\u2588"
    static barIncompleteChar: string = "\u2591"
    static barsize: number = 20

    static getLoadingProgressBar(options: progress.Options) {
        return this.getProgress(options, ProgressType.LOADING)
    }

    static getDownloadProgressBar(options: progress.Options) {
        return this.getProgress(options, ProgressType.DOWNLOAD)
    }

    private static getProgress(options: progress.Options, type: ProgressType) {
        let info = progress(options)
        process.stdout.write('\x1B[?25l') // Hide cursor
        info.on('progress', progress => {
            process.stdout.clearLine(0)
            process.stdout.cursorTo(0)
            switch (type) {
                case ProgressType.LOADING:
                    process.stdout.write(this.getLoadingProgressTemplate(progress))
                    break;
                case ProgressType.DOWNLOAD:
                    process.stdout.write(this.getDownloadProgressTemplate(progress))
                    break;
            }
        })
        info.on('end', () => {
            process.stdout.clearLine(0)
            process.stdout.cursorTo(0)
            process.stdout.write('\x1B[?25h') // Show cursor
        })
        return info
    }

    private static getLoadingProgressTemplate(progress: progress.Progress) {
        const string = "{bar} {percent}%" // Для выноса потом в lang файлы
        return string
            .replace("{bar}", this.getBar(progress.percentage))
            .replace("{percent}", progress.percentage.toFixed(2))
    }

    private static getDownloadProgressTemplate(progress: progress.Progress) {
        const string = "{bar} {percent}% Осталось: {eta}s | Скорость: {speed}/s {transferred}/{total}" // Аналогично
        return string
            .replace("{bar}", this.getBar(progress.percentage))
            .replace("{percent}", progress.percentage.toFixed(2))
            .replace("{eta}", progress.eta.toString())
            .replace("{speed}", this.bytesToSize(progress.speed))
            .replace("{transferred}", this.bytesToSize(progress.transferred))
            .replace("{total}", this.bytesToSize(progress.length))
    }

    private static getBar(percentage: number): string {
        // calculate barsize
        const completeSize = Math.round(percentage / 100 * this.barsize)
        const incompleteSize = this.barsize - completeSize

        // generate bar string by stripping the pre-rendered strings
        return this.barCompleteChar.repeat(completeSize)
        +  this.barIncompleteChar.repeat(incompleteSize)
    }

    private static bytesToSize(bytes: number): string {
        const sizes = ["Bytes", "KB", "MB"]
        if (bytes === 0) return "n/a"
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        if (i === 0) return `${bytes} ${sizes[i]})`
        return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
    }
}

export enum ProgressType {
    DOWNLOAD,
    LOADING
}