import { A_Namespace } from "../A-Namespace/A_Namespace.class";



/**
 * This element only contains the specific code
 * 
 */
export class A_Component<T extends A_Namespace = A_Namespace> {

    constructor(
        /**
         * Primary context that impacts the component behavior
         */
        protected namespace: A_Namespace
    ) {

    }




    // constructor(
    //     private auth: A_AUTH_Context,
    //     private arc: A_ARC_Context,
    //     private products: A_PRODUCTS_Context,
    //     private express: A_EXPRESS_Context,
    // ) { 

    // }


}