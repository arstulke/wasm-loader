import { isBrowser } from "./util.ts";
import { BaseWasmLoader as FetchBaseWasmLoader } from "../env-browser/wasm-loader.ts";
import { IBaseWasmLoader, WasmInstantiated, ModuleFile, ModuleSource } from "../wasm-loader-types.ts";

export abstract class BaseWasmLoader extends FetchBaseWasmLoader {

    protected async loadAndInstantiate(moduleFile: ModuleFile,
                                       moduleType: ModuleSource,
                                       importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const isFetch = moduleType == ModuleSource.EXTERNAL || isBrowser;
        
        if (isFetch) {
            return await this.loadAndInstantiate(moduleFile, moduleType, importObject);
        } else {
            const moduleFileStr = this.getModuleFileString(isFetch, moduleFile);
            return await this.loadFromLocalFile(moduleFileStr, importObject);
        }
    }

    private async loadFromLocalFile(moduleFile: string,
                                    importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const bytes: Uint8Array = await Deno.readFile(moduleFile);
        return await WebAssembly.instantiate(bytes, importObject);
    }
}
