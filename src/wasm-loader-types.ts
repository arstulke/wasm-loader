export enum ModuleSource { LOCAL, EXTERNAL}
export type ModuleInstance<T> = WebAssembly.Instance & { exports: T };
export type ModuleFile = string | ((isLocalFile: boolean) => string);
export type WasmInstantiated = WebAssembly.WebAssemblyInstantiatedSource;

export interface IWasmLoader {
    loadAndRun<T>(
        moduleFile: string,
        moduleType: ModuleSource,
        moduleImports: WebAssembly.ModuleImports): Promise<ModuleInstance<T>>;
}

export abstract class IBaseWasmLoader implements IWasmLoader {
    
    abstract loadAndRun<T>(
        moduleFile: ModuleFile,
        moduleType: ModuleSource,
        moduleImports: WebAssembly.ModuleImports): Promise<ModuleInstance<T>>;

    protected abstract loadAndInstantiate(moduleFile: ModuleFile,
        moduleType: ModuleSource,
        importObject: WebAssembly.Imports): Promise<WasmInstantiated>;
}
