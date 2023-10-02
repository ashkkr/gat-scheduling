import { atom } from 'recoil';

export const loadingState = atom({
    key: 'isLoading',
    default: false
});

export const clientListState = atom({
    key: 'clientList',
    default: []
});

export const selectedClientindexState = atom({
    key: 'selectedClientindex',
    default: 0
});

export const clientemaildetails = atom({
    key: 'clientemaildetails',
    default: {
        lastEmail: '',
        nextEmail: ''
    }
});

export const clientdocdetails = atom({
    key: 'docdetails',
    default: { lastdocdate: '', doclocation: '' }
});

export const currentClient = atom({
    key: 'currentclientdetails',
    default: {
        clientName: '',
        clientEmail: '',
        clientNumber: '',
        gstUsername: '',
        gstNumber: '',
        gstPassword: '',
        isActive: false
    }
})

export const searchString = atom({
    key: 'StringToBeSearched',
    default: ''
});
