import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";


export class ContextFragmentB extends A_Fragment {

    variable: number = 0;

    constructor() {
        super();
    }


    increment(): void {
        this.variable++;

        console.log('ContextFragmentB -> Variable incremented to: ', this.variable);
    }

}