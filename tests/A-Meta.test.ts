import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.constants";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A-Concept.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";

jest.retryTimes(0);

describe('A-Meta tests', () => {
    it('Should Allow to create a Meta instance', async () => {
        const meta = new A_Meta();

        expect(meta).toBeInstanceOf(A_Meta);
    });

    it('Should Allow to get prop meta for component Feature', async () => {

        class ComponentA extends A_Component {

            @A_Feature.Extend()
            async test() {

            }
        }

        const meta = A_Context.meta(ComponentA);

        expect(meta).toBeInstanceOf(A_ComponentMeta);
        expect(meta.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.size()).toBe(1);
        expect(meta.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.has('^.*test$')).toBe(true);
    })
    it('Should correctly create abstractions meta', async () => {

        class ComponentB extends A_Component {

            @A_Concept.Load()
            async test() {

            }
        }

        class ComponentC extends ComponentB {
            async test() {

            }
            @A_Concept.Load()
            async test2() {

            }
        }

        class ComponentE extends ComponentB {

            @A_Concept.Load()
            async test3() {

            }
        }

        const metaC = A_Context.meta(ComponentC);
        const metaE = A_Context.meta(ComponentE);

        expect(metaC).toBeInstanceOf(A_ComponentMeta);
        expect(metaC.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.size()).toBe(1);
        expect(metaC.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.has('CONCEPT_ABSTRACTION::load')).toBe(true);
        expect(metaC.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.length).toBe(2);
        expect(metaC.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.map(e => e.handler)).toContain('test2');
        expect(metaC.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.map(e => e.handler)).not.toContain('tes3');

        expect(metaE).toBeInstanceOf(A_ComponentMeta);
        expect(metaE.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.size()).toBe(1);
        expect(metaE.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.has('CONCEPT_ABSTRACTION::load')).toBe(true);
        expect(metaE.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.length).toBe(2);
        expect(metaE.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.map(e => e.handler)).toContain('test3');
        expect(metaE.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)?.get('CONCEPT_ABSTRACTION::load')?.map(e => e.handler)).not.toContain('test2');
    })

    it('Should correctly create features meta', async () => {

        class ComponentB extends A_Component {

            @A_Feature.Extend({
                name: 'testFeature'
            })
            async test() {

            }
        }

        class ComponentC extends ComponentB {
            async test() {

            }
            @A_Feature.Extend({
                name: 'testFeature'
            })
            async test2() {

            }
        }

        class ComponentE extends ComponentB {

            @A_Feature.Extend({
                name: 'testFeature'
            })
            async test3() {

            }
        }

        const metaC = A_Context.meta(ComponentC);
        const metaE = A_Context.meta(ComponentE);

        expect(metaC).toBeInstanceOf(A_ComponentMeta);
        expect(metaC.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.size()).toBe(1);
        expect(metaC.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.has('.*\\.testFeature$')).toBe(true);
        expect(metaC.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.length).toBe(2);
        expect(metaC.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.map(e => e.handler)).toContain('test2');
        expect(metaC.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.map(e => e.handler)).not.toContain('tes3');

        expect(metaE).toBeInstanceOf(A_ComponentMeta);
        expect(metaE.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.size()).toBe(1);
        expect(metaE.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.has('.*\\.testFeature$')).toBe(true);
        expect(metaE.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.length).toBe(2);
        expect(metaE.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.map(e => e.handler)).toContain('test3');
        expect(metaE.get(A_TYPES__ComponentMetaKey.EXTENSIONS)?.get('.*\\.testFeature$')?.map(e => e.handler)).not.toContain('test2');
    })
})  