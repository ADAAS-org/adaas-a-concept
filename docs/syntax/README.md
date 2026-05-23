# ADAAS Concept — Monaco Editor Syntax

Custom Monaco syntax highlighting for the **ADAAS Concept** framework,
built **on top of TypeScript/JavaScript**.

---

## Files

| File | Purpose |
|---|---|
| `adaas-concept.tokens.ts` | Token-type string constants + keyword lists |
| `adaas-concept.monarch.ts` | Monarch tokenizer (language grammar) |
| `adaas-concept.theme.ts` | Dark and light theme colour rules |
| `adaas-concept.register.ts` | One-call registration helper |

---

## Quick start

```ts
import * as monaco from 'monaco-editor';
import { registerAdaasConceptLanguage } from './docs/syntax/adaas-concept.register';

// Call once before creating editors
registerAdaasConceptLanguage(monaco);

// Create an editor with the custom language
const editor = monaco.editor.create(document.getElementById('container')!, {
  value: sampleCode,
  language: 'adaas-ts',
  theme:    'adaas-dark',    // or 'adaas-light'
});
```

---

## Highlighted tokens

### Core framework classes
> Bright cyan (`bold`) — the prime building blocks of every ADAAS application.

| Class | Role |
|---|---|
| `A_Concept` | Root application container |
| `A_Container` | Stateful runtime unit (HTTP server, worker, …) |
| `A_Component` | Stateless singleton pluggable unit |
| `A_Entity` | Business-domain object with `ASEID` identity |
| `A_Fragment` | Shared-memory singleton execution context |
| `A_Feature` | Distributed pipeline across components |
| `A_Abstraction` | Cross-container concept operation |
| `A_Stage` | Single callable step in a feature pipeline |
| `A_StepsManager` | Topological step sorter for feature pipelines |
| `A_Scope` | Scoped DI / resource container |
| `A_Context` | Global singleton registry / meta store |
| `A_Dependency` | Dependency resolution descriptor |
| `A_Caller` | Identifies which component initiated a feature call |
| `A_Meta` | Typed key-value metadata store |
| `ASEID` | Application–Scope–Entity–ID identifier |

---

### Meta companion classes
> Soft blue — typed metadata stores paired with core classes.

`A_ComponentMeta` · `A_ContainerMeta` · `A_ConceptMeta` · `A_EntityMeta`

---

### Error classes
> Salmon-red (`italic`) — should stand out immediately.

`A_Error` · `A_AbstractionError` · `A_ContextError` · `A_DependencyError`
`A_EntityError` · `A_FeatureError` · `A_InjectError` · `A_ScopeError`
`A_StageError` · `A_StepManagerError` · `A_CallerError`

---

### Helper / utility classes
> Desaturated yellow — utility, not domain logic.

`A_TypeGuards` · `A_BasicTypeGuards` · `A_CommonHelper`
`A_FormatterHelper` · `A_IdentityHelper`

---

### Decorators
> Magenta (`bold`) — special syntax sugar for wiring components together.

#### Standalone decorators (raw function usage)
| Decorator | Import name | Typical usage |
|---|---|---|
| `@A_Inject` | `A_Inject` | `@A_Inject(ComponentClass)` on a constructor param |
| `@A_MetaDecorator` | `A_MetaDecorator` | `@A_Meta.Define(MetaClass)` alias |
| `@A_Feature_Define` | `A_Feature_Define` | direct import variant of `@A_Feature.Define` |
| `@A_Feature_Extend` | `A_Feature_Extend` | direct import variant of `@A_Feature.Extend` |
| `@A_Abstraction_Extend` | `A_Abstraction_Extend` | direct import variant |
| `@A_Dependency_*` | individual imports | `@A_Dependency_All`, `@A_Dependency_Require`, … |

#### Compound decorators (namespace + method)
The **namespace** is highlighted magenta and the **.Method** segment is warm orange.

| Pattern | Decorates | Methods |
|---|---|---|
| `@A_Feature.Define(…)` | method | `Define` |
| `@A_Feature.Extend(…)` | method | `Extend` |
| `@A_Abstraction.Extend(…)` | method | `Extend` |
| `@A_Meta.Define(…)` | class | `Define` |
| `@A_Dependency.Required()` | property | `Required` |
| `@A_Dependency.Loaded()` | property | `Loaded` |
| `@A_Dependency.Default(…)` | property | `Default` |
| `@A_Dependency.Parent(…)` | property | `Parent` |
| `@A_Dependency.Flat()` | property | `Flat` |
| `@A_Dependency.All()` | property | `All` |
| `@A_Dependency.Query(…)` | property | `Query` |
| `@A_Concept.Load(…)` | method | `Load` |
| `@A_Concept.Publish(…)` | method | `Publish` |
| `@A_Concept.Deploy(…)` | method | `Deploy` |
| `@A_Concept.Build(…)` | method | `Build` |
| `@A_Concept.Run(…)` | method | `Run` |
| `@A_Concept.Start(…)` | method | `Start` |
| `@A_Concept.Stop(…)` | method | `Stop` |

---

### Type identifiers
> Teal (`italic`) — type-level constructs (interfaces, type aliases).

Any identifier matching `A_TYPES__*`, for example:

`A_TYPES__Ctor` · `A_TYPES__DeepPartial` · `A_TYPES__FeatureAvailableComponents`
`A_TYPES__ConceptAbstractions` · `A_TYPES__A_Stage_Status` · …

---

### Constants
> Muted gold — framework constants.

Any identifier matching `A_CONSTANTS__*`, for example:

`A_CONSTANTS__ERROR_CODES` · `A_CONSTANTS__ERROR_DESCRIPTION`

---

## Colour reference

### Dark theme (`adaas-dark`)

| Token | Hex | Preview |
|---|---|---|
| Core class | `#4FC1FF` | ![#4FC1FF](https://via.placeholder.com/12/4FC1FF/4FC1FF.png) |
| Meta class | `#9CDCFE` | ![#9CDCFE](https://via.placeholder.com/12/9CDCFE/9CDCFE.png) |
| Error class | `#F48771` | ![#F48771](https://via.placeholder.com/12/F48771/F48771.png) |
| Helper class | `#DCDCAA` | ![#DCDCAA](https://via.placeholder.com/12/DCDCAA/DCDCAA.png) |
| Decorator | `#C586C0` | ![#C586C0](https://via.placeholder.com/12/C586C0/C586C0.png) |
| Decorator method | `#CE9178` | ![#CE9178](https://via.placeholder.com/12/CE9178/CE9178.png) |
| Type identifier | `#4EC9B0` | ![#4EC9B0](https://via.placeholder.com/12/4EC9B0/4EC9B0.png) |
| Constant | `#D7BA7D` | ![#D7BA7D](https://via.placeholder.com/12/D7BA7D/D7BA7D.png) |

### Light theme (`adaas-light`)

| Token | Hex |
|---|---|
| Core class | `#0070C1` |
| Meta class | `#001080` |
| Error class | `#A31515` |
| Helper class | `#795E26` |
| Decorator | `#AF00DB` |
| Decorator method | `#863B00` |
| Type identifier | `#267F99` |
| Constant | `#0000FF` |

---

## Example code

```typescript
import {
  A_Concept, A_Container, A_Component,
  A_Entity, A_Feature, A_Fragment,
  A_Inject, A_Meta, ASEID,
} from '@adaas/a-concept';
import type { A_TYPES__Component_Init } from '@adaas/a-concept';

// ── Meta ──────────────────────────────────────────────────────────────────────

@A_Meta.Define
class AppMeta extends A_Meta<{ version: string }> {}

// ── Component ─────────────────────────────────────────────────────────────────

export class LoggerComponent extends A_Component {
  @A_Dependency.Required()
  declare config: ConfigComponent;

  @A_Feature.Define()
  async log(feature: A_Feature, message: string): Promise<void> {
    console.log(`[${new Date().toISOString()}] ${message}`);
    await feature.next();
  }
}

// ── Container ─────────────────────────────────────────────────────────────────

export class AppContainer extends A_Container {
  @A_Dependency.Loaded()
  declare logger: LoggerComponent;

  @A_Abstraction.Extend('startup')
  async onStartup(): Promise<void> {
    await this.logger.log(this.feature!, 'Container started');
  }
}

// ── Concept ───────────────────────────────────────────────────────────────────

export class App extends A_Concept {
  @A_Concept.Start()
  async start(): Promise<void> {
    await this.deploy();
  }

  @A_Concept.Stop()
  async stop(): Promise<void> {
    await this.undeploy();
  }
}
```

---

## Architecture

The language is registered as `adaas-ts` and can be applied to any Monaco
model.  It piggybacks on Monaco's built-in TypeScript support for everything
except ADAAS-specific identifiers:

```
Monaco TypeScript (built-in)
  └─ adaas-ts (Monarch tokenizer)
       ├─ All TypeScript keywords, operators, strings, numbers, …
       ├─ @decorator → adaas.decorator / adaas.decoratorNamespace
       │    └─ .Method → adaas.decoratorMethod
       ├─ A_* classes → adaas.coreClass | adaas.metaClass | …
       ├─ A_TYPES__* → adaas.typeIdentifier
       └─ A_CONSTANTS__* → adaas.constant
```
