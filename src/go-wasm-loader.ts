import { BaseWasmLoader, ModuleInstance, ModuleSource } from './wasm-loader.ts';
import "https://raw.githubusercontent.com/tinygo-org/tinygo/release/targets/wasm_exec.js";

declare const global: {
    Go: {
        new(): any;
        importObject: object,
        run(): void,
    }
};

export class GoWasmLoader extends BaseWasmLoader {
    async loadAndRun<T>(
        moduleFile: string,
        moduleType: ModuleSource,
        moduleImports: WebAssembly.ModuleImports): Promise<ModuleInstance<T>> {

        const go = new global.Go();
        const importObject = go.importObject;
        Object.assign(importObject.env, moduleImports);

        const obj = await this.loadAndInstantiate(moduleFile, moduleType, importObject);

        const wasmInstance: ModuleInstance<T> = obj.instance as ModuleInstance<T>;
        go.run(wasmInstance);

        return wasmInstance;
    }
}
