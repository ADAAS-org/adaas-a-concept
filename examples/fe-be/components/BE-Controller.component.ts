import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";



export class BEController extends A_Component {



    @A_Feature.Define({
        name: 'getOrdersCount',
        // channel
    })
    getOrdersCount() {

        return 0;
    }


}