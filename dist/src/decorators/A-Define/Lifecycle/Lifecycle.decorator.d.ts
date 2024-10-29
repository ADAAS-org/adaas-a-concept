/**
 * A-Lifecycle decorator
 *
 * This decorator allows to define a custom lifecycle stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Lifecycle and A-Feature decorators is that A-Lifecycle methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
export declare function A_Lifecycle(): any;
