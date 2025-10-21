import { A_Error } from "../A-Error/A_Error.class";



export class A_ContextError extends A_Error {


    static NotAllowedForScopeAllocationError = 'Component is not allowed for scope allocation';

    static ComponentAlreadyHasScopeAllocatedError = 'Component already has scope allocated';

    static InvalidMetaParameterError = 'Invalid parameter provided to get meta';

    static InvalidScopeParameterError = 'Invalid parameter provided to get scope';

    static ScopeNotFoundError = 'Scope not found';

    static InvalidFeatureParameterError = 'Invalid parameter provided to get feature';

    static InvalidFeatureDefinitionParameterError = 'Invalid parameter provided to define feature';

    static InvalidFeatureTemplateParameterError = 'Invalid parameter provided to get feature template';

    static InvalidFeatureExtensionParameterError = 'Invalid parameter provided to extend feature';


    static InvalidAbstractionParameterError = 'Invalid parameter provided to get abstraction';

    static InvalidAbstractionDefinitionParameterError = 'Invalid parameter provided to define abstraction';

    static InvalidAbstractionTemplateParameterError = 'Invalid parameter provided to get abstraction template';

    static InvalidAbstractionExtensionParameterError = 'Invalid parameter provided to extend abstraction';

    static InvalidInjectionParameterError = 'Invalid parameter provided to get injections';

    static InvalidExtensionParameterError = 'Invalid parameter provided to get extensions';


    static InvalidRegisterParameterError = 'Invalid parameter provided to register component';


    static InvalidComponentParameterError = 'Invalid component provided';
}