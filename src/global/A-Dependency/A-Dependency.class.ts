import { A_Dependency_Default } from "./A-Dependency-Default.decorator";
import { A_Dependency_Load } from "./A-Dependency-Load.decorator";
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
}