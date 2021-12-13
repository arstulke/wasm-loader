import { IBaseWasmLoader, WasmInstantiated, ModuleFile, ModuleSource } from "../wasm-loader-types.ts";

export abstract class BaseWasmLoader extends IBaseWasmLoader {

    protected async loadAndInstantiate(moduleFile: ModuleFile,
                                       moduleType: ModuleSource,
                                       importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const isFetch = true;
        const moduleFileStr = this.getModuleFileString(isFetch, moduleFile);
        return await this.loadFromWeb(moduleFileStr, importObject);
    }

    private async loadFromWeb(moduleFile: string,
                              importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const responsePromise = fetch(moduleFile);
        if ('instantiateStreaming' in WebAssembly) {
            return await WebAssembly.instantiateStreaming(responsePromise, importObject);
        } else {
            const response = await responsePromise;
            const bytes = await response.arrayBuffer();
            return await WebAssembly.instantiate(bytes, importObject);
        }
    }

    protected getModuleFileString(isFetch: boolean, moduleFile: ModuleFile): string {
        return typeof moduleFile === 'function' ? moduleFile(isFetch) : moduleFile;
    }
}
