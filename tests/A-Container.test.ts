import { A_Container } from '@adaas/a-concept/global/A-Container/A-Container.class';
import { A_Scope } from '@adaas/a-concept/global/A-Scope/A-Scope.class';
import { A_Concept, A_Feature } from '../src';


describe('A-Container tests', () => {

    it('Should allow to create a concept', async () => {
        const container = new A_Container();
        expect(container).toBeInstanceOf(A_Container);
        expect(container.scope).toBeDefined();
        expect(container.scope).toBeInstanceOf(A_Scope);
    });
    it('Should allow to define and extend features on container level', async () => {
        const results: string[] = [];


        class customContainer extends A_Container {


            @A_Concept.Start()
            async start() {
                results.push('started');

                await this.call('testFeature');
            }

            @A_Feature.Extend({
                name: 'testFeature',
            })
            async extendFeature() {
                results.push('extended');
            }
        }


        const myContainer = new customContainer();
        const concept = new A_Concept({
            containers: [myContainer]
        });

        await concept.start();

        expect(results).toEqual(['started', 'extended']);
    });


});