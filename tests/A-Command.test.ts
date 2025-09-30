


import { A_CONSTANTS__A_Command_Status, A_CONSTANTS_A_Command_Features } from "@adaas/a-concept/base/A-Command/A_Command.constants";
import { A_Command } from "@adaas/a-concept/base/A-Command/A_Command.entity";
import { A_CommandContext } from "@adaas/a-concept/base/A-Command/context/A_Command.context";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Error } from "@adaas/a-utils";

jest.retryTimes(0);

describe('A-Command tests', () => {

    it('Should Allow to create a command', async () => {
        const command = new A_Command({});
        expect(command).toBeInstanceOf(A_Command);
        expect(command.Code).toBe('A_Command');
        expect(command.id).toBeDefined();
        expect(command.aseid).toBeDefined();
        expect(command.Status).toBe(A_CONSTANTS__A_Command_Status.INITIALIZED);
        expect(command.Scope).toBeInstanceOf(A_Scope);
        expect(command.Scope.resolve(A_CommandContext)).toBeInstanceOf(A_CommandContext);
    });
    it('Should allow to execute a command', async () => {
        const command = new A_Command({});

        await command.execute();

        expect(command.Status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
        expect(command.StartedAt).toBeInstanceOf(Date);
        expect(command.EndedAt).toBeInstanceOf(Date);
    });
    it('Should allow to serialize and deserialize a command', async () => {
        const command = new A_Command({});

        await command.execute();

        const serialized = command.toJSON();
        expect(serialized).toBeDefined();
        expect(serialized.aseid).toBe(command.aseid.toString());
        expect(serialized.code).toBe(command.Code);
        expect(serialized.status).toBe(command.Status);
        expect(serialized.startedAt).toBe(command.StartedAt?.toISOString());
        expect(serialized.duration).toBe(command.Duration);


        const deserializedCommand = new A_Command(serialized);
        expect(deserializedCommand).toBeInstanceOf(A_Command);
        expect(deserializedCommand.aseid.toString()).toBe(command.aseid.toString());
        expect(deserializedCommand.Code).toBe(command.Code);
        expect(deserializedCommand.Status).toBe(command.Status);
        expect(deserializedCommand.StartedAt?.toISOString()).toBe(command.StartedAt?.toISOString());
        expect(deserializedCommand.Duration).toBe(command.Duration);
    });
    it('Should allow to execute a command with custom logic', async () => {

        // 1) create a scope 
        const scope = new A_Scope({ name: 'TestScope' });
        // 2) create a new command 
        type resultType = { bar: string };
        type invokeType = { foo: string };
        class MyCommand extends A_Command<invokeType, resultType> { }

        // 3) create a custom component with custom logic
        class MyComponent extends A_Component {

            @A_Feature.Extend({ scope: [MyCommand] })
            async [A_CONSTANTS_A_Command_Features.EXECUTE](
                @A_Inject(A_CommandContext) context: A_CommandContext<resultType>
            ) {
                context.save('bar', 'baz');
            }
        }

        // 4) register component in the scope
        scope.register(MyComponent);

        // 5) create a new command instance within the scope
        const command = new MyCommand({ foo: 'bar' });
        scope.register(command);

        // 6) execute the command
        await command.execute();

        // 7) verify that command was executed with custom logic from MyComponent
        expect(command.Status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
        expect(command.Result).toBeDefined();
        expect(command.Result).toEqual({ bar: 'baz' });
    })
    it('Should allow to fail a command with custom logic', async () => {

        // 1) create a scope 
        const scope = new A_Scope({ name: 'TestScope' });
        // 2) create a new command 
        type resultType = { bar: string };
        type invokeType = { foo: string };
        class MyCommand extends A_Command<invokeType, resultType> { }

        // 3) create a custom component with custom logic
        class MyComponent extends A_Component {

            @A_Feature.Extend({ scope: [MyCommand] })
            async [A_CONSTANTS_A_Command_Features.EXECUTE](
                @A_Inject(A_CommandContext) context: A_CommandContext<resultType>
            ) {
                context.error(new A_Error({ message: 'Test error' }));
                //  it's optional to throw an error here, as the command may contain multiple errors that also can be a result of async operations
                throw new A_Error({ message: 'Test error thrown' });
            }
        }

        // 4) register component in the scope
        scope.register(MyComponent);
        // 5) create a new command instance within the scope
        const command = new MyCommand({ foo: 'bar' });
        scope.register(command);

        // 6) execute the command
        await command.execute();

        // 7) verify that command was executed with custom logic from MyComponent
        expect(command.Status).toBe(A_CONSTANTS__A_Command_Status.FAILED);
        expect(command.Errors).toBeDefined();
        expect(command.Errors?.size).toBe(1);
        expect(Array.from(command.Errors?.values() || [])[0].message).toBe('Test error');
    });
});