/**
 * AuroraLauncher LauncherServer - Server for AuroraLauncher
 * Copyright (C) 2020 - 2021 AuroraTeam

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as fs from "fs"
import * as path from "path"

import { LogHelper } from "../helpers/LogHelper"
import { StorageHelper } from "../helpers/StorageHelper"
import { App } from "../LauncherServer"
import { ClientProfile, ClientProfileConfig } from "./ProfileConfig"

export class ProfilesManager {
    profiles: ClientProfile[] = []

    constructor() {
        this.loadProfiles()
    }

    /**
     * Загрузка профилей в память лаунчер-сервера
     */
    loadProfiles(): void {
        const files = fs.readdirSync(StorageHelper.profilesDir)

        if (files.length === 0) return LogHelper.info(App.LangManager.getTranslate("ProfilesManager.syncSkip"))
        else LogHelper.info(App.LangManager.getTranslate("ProfilesManager.sync"))

        files.forEach((file) => {
            if (!file.endsWith(".json")) return

            try {
                const data = JSON.parse(fs.readFileSync(path.resolve(StorageHelper.profilesDir, file)).toString())
                this.profiles.push(new ClientProfile(data))
            } catch (e) {
                if (e instanceof SyntaxError)
                    LogHelper.error(App.LangManager.getTranslate("ProfilesManager.loadingErr"), file)
                else LogHelper.error(e)
            }
        })
        LogHelper.info(App.LangManager.getTranslate("ProfilesManager.syncEnd"))
    }

    /**
     * Перезагрузка профилей в памяти лаунчер-сервера
     */
    reloadProfiles(): void {
        this.profiles = []
        this.loadProfiles()
    }

    createProfile(parametrs: ClientProfileConfig): void {
        const profile = new ClientProfile(parametrs)
        fs.writeFileSync(path.resolve(StorageHelper.profilesDir, `${parametrs.clientDir}.json`), profile.toString())
        return
    }
}
