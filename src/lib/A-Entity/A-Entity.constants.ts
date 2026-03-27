export enum A_TYPES__EntityMetaKey {
    EXTENSIONS = 'a-component-extensions',
    FEATURES = 'a-component-features',
    ABSTRACTIONS = 'a-component-abstractions',
    INJECTIONS = 'a-component-injections',
}

export const A_TYPES__EntityFeatures = {
    SAVE: '_A_Entity__Save',
    DESTROY: '_A_Entity__Destroy',
    LOAD: '_A_Entity__Load'
} as const;