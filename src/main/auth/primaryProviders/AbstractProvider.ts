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

import { wsErrorResponseWithoutUUID, wsResponseWithoutUUID } from "../../requests/types/AbstractRequest"
export abstract class AbstractProvider {
    protected type: string
    abstract config: any

    abstract emit(login: string, password: string, ip: string): wsResponseWithoutUUID | wsErrorResponseWithoutUUID

    public getType(): string {
        return this.type
    }
}

export class PrimaryProviderConfig {
    type: string

    static getDefaults(): PrimaryProviderConfig {
        const defaults = new PrimaryProviderConfig()
        defaults.type = "accept"
        return defaults
    }
}
