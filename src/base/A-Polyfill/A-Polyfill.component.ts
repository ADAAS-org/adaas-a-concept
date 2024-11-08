import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Polyfills } from "@adaas/a-utils";



export class A_Polyfill extends A_Component {

    private fs!: any;


    @A_Concept.Load()
    async load() {
        const fs = await A_Polyfills.fs();

        this.fs = fs;
    }
}