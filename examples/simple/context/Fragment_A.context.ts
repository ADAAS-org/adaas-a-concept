import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";




export class ContextFragmentA extends A_Fragment {


    variable: number = 0;

    constructor() {
        super();
    }




    decrement(): void {
        this.variable--;

        console.log('ContextFragmentA -> Variable decremented to: ', this.variable);
    }
}


