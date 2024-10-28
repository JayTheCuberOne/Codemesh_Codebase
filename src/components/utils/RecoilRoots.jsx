import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const currentWorkspaceState = atom({
    key: 'currentWorkspaceState',
    default: -1,
    effects_UNSTABLE: [persistAtom],
});

export const selectableDataState = atom({
    key: 'selectableDataState',
    default: ['iris', 'wine', 'boston']
});

export const selectedDataState = atom({
    key: 'selectedDataState',
    default: 'iris',
})

export const trainingPortionState = atom({
    key: 'trainingPortionState',
    default: 30,
});

export const NaNvalueconversionState = atom({
    key: 'NaNvalueconversionState',
    default: null,
});

export const targetColumnState = atom({
    key: 'targetColumnState',
    default: null,
});

export const regressionModelState = atom({
    key: 'regressionModelState',
    default: 'linearregression',
});

export const regressionModelOptionState = atom({
    key: 'regressionModelOptionState',
    default: null,
});

export const classifierModelState = atom({
    key: 'classifierModelState',
    default: 'gaussiannb',
});

export const classifierModelOptionState = atom({
    key: 'classifierModelOptionState',
    default: 'accuracy',
});

export const accuracyTypeState = atom({
    key: 'accuracyTypeState',
    default: null,
});

export const accuracyContentState = atom({
    key: 'accuracyContentState',
    default: null,
});

export const jwtTokenState = atom({
    key: 'jwt',
    default: null,
});