export type ModuleInstance<T> = WebAssembly.Instance & { exports: T };

export enum ModuleSource {
    LOCAL,
    EXTERNAL
}

export interface IWasmLoader {
    loadAndRun<T>(
        moduleFile: string,
        moduleType: ModuleSource,
        moduleImports: WebAssembly.ModuleImports): Promise<ModuleInstance<T>>;
}

type WasmInstantiated = WebAssembly.WebAssemblyInstantiatedSource;

export abstract class BaseWasmLoader implements IWasmLoader {

    abstract loadAndRun<T>(
        moduleFile: string,
        moduleType: ModuleSource,
        moduleImports: WebAssembly.ModuleImports): Promise<ModuleInstance<T>>;

    protected async loadAndInstantiate(moduleFile: string,
                                       moduleType: ModuleSource,
                                       importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const isFetch = this.isFetch(moduleType);
        if (isFetch) {
            return await this.loadFromWeb(moduleFile, importObject);
        } else {
            return await this.loadFromLocalFile(moduleFile, importObject);
        }
    }

    private async loadFromLocalFile(moduleFile: string,
                                    importObject: WebAssembly.Imports): Promise<WasmInstantiated> {
        const bytes: Uint8Array = await Deno.readFile(moduleFile);
        return await WebAssembly.instantiate(bytes, importObject);
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

    private isFetch(moduleType: ModuleSource): boolean {
        const isBrowser = typeof window === 'undefined';
        return moduleType == ModuleSource.EXTERNAL || isBrowser;
    }
}
