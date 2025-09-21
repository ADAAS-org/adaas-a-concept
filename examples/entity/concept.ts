import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { User } from "./entities/User.entity";
import { ASEID } from "@adaas/a-utils";
import { Task } from "./entities/Task.entity";

(async () => {
    const concept = new A_Concept({
        name: 'test-entity',
        fragments: [
            new A_Config({
                variables: ['CONFIG_VERBOSE'],
                defaults: {
                    'CONFIG_VERBOSE': true
                }
            })
        ],
        entities: [
            new User(new ASEID({ namespace: 'test-entity', scope: 'default', entity: 'user', id: 1 })),
            new User({
                name: 'User 2',
                email: 'user2@test.com'
            }),
            new Task(new ASEID({ namespace: 'test-entity', scope: 'default', entity: 'task', id: 1 })),
            new Task(new ASEID({ namespace: 'test-entity', scope: 'default', entity: 'task', id: 2 })),
            new Task ('https://example.com/task/3')
        ]
    });

    const user1 = concept.resolve(User, {
        query: {
            id: '1'
        }
    });

    console.log('Resolved user 1:', user1);

    const user2 = concept.resolve(User, {
        query: {
            id: '2'
        }
    });

    console.log('Resolved user 2:', user2);


    const task1 = concept.resolve(Task, {
        query: {
            id: '1'
        }
    });


    const task3 = concept.resolve(Task, {
        query: {
            id: '3'
        }
    });

    console.log('Resolved task 1:', task1);
    console.log('Resolved task 3:', task3);






})();