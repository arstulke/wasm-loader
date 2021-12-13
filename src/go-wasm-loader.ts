import { BaseWasmLoader } from './env/wasm-loader.ts';
import { ModuleSource } from './wasm-loader-types.ts';
import type { ModuleInstance, ModuleFile } from './wasm-loader-types.ts';
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
        moduleFile: ModuleFile,
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
