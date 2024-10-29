import { A_TYPES__FragmentConstructor } from "../../global/A-Fragment/A-Fragment.types";
import { A_TYPES__Dictionary, A_TYPES__Error } from "@adaas/a-utils";
export type A_TYPES__A_ErrorsConstructor = {
    errors: A_TYPES__Dictionary<A_TYPES__Error> | A_TYPES__Error[];
} & A_TYPES__FragmentConstructor;
