import { A_Dependency_Default } from "./A-Dependency-Default.decorator";
import { A_Dependency_Load } from "./A-Dependency-Load.decorator";
import { A_Dependency_Parent } from "./A-Dependency-Parent.decorator";
import { A_Dependency_Require } from "./A-Dependency-Require.decorator";


export class A_Dependency {
    /**
     * Allows to indicate which Injected parameter is required
     * 
     * [!] If parameter marked as required is not provided, an error will be thrown
     * 
     * @returns 
     */
    static get Required(): typeof A_Dependency_Require {
        return A_Dependency_Require;
    }
    /**
     * Allows to indicate which dependency should be loaded from a specific path
     * 
     * @returns 
     */
    static get Loaded(): typeof A_Dependency_Load {
        return A_Dependency_Load;
    }
    /**
     * Allows to indicate which dependency default parameters should be used
     * 
     * @returns 
     */
    static get Default(): typeof A_Dependency_Default {
        return A_Dependency_Default;
    }
    /**
     * Allows to indicate which parent dependency should be resolved
     * e.g. from which layer up the parent should be taken
     * 
     * @returns 
     */
    static get Parent(): typeof A_Dependency_Parent {
        return A_Dependency_Parent;
    }

    protected _name: string;

    /**
     * Class instances allows to indentify dependencies by name and use them for better type checking
     * 
     * @param name 
     */
    constructor(
        name: string
    ) {
        this._name = name;
    }

    /**
     * Gets the dependency name
     * 
     * Can be identifier, url or any string value
     * 
     * @returns 
     */
    get name(): string {
        return this._name;
    }
}