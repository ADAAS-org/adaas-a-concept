import { A_Container } from '@adaas/a-concept/global/A-Container/A-Container.class';
import { A_Scope } from '@adaas/a-concept/global/A-Scope/A-Scope.class';


describe('A-Container tests', () => {

    it('Should Allow to create a concept', async () => {
        const container = new A_Container();
        expect(container).toBeInstanceOf(A_Container);
        expect(container.scope).toBeDefined();
        expect(container.scope).toBeInstanceOf(A_Scope);
    });


});