import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__EntityMeta } from "./A-Entity.types";
import { A_TYPES__A_DefineDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
export declare class A_EntityMeta extends A_Meta<A_TYPES__EntityMeta> {
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features(): Array<A_TYPES__A_DefineDecorator_Meta>;
}
