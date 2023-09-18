import { createContext, useContext, useEffect, useState } from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import './index.css';
import Spinner from 'react-bootstrap/Spinner';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

function fetchClientDetails() {
    const setClientList = useSetRecoilState(clientListState);
    const setCurrClient = useSetRecoilState(currentClient);

    useEffect(() => {
        fetch("http://localhost:3000/clientlist").then((res) => {
            res.json().then((data) => {
                setClientList(data);
                setCurrClient(data[0]);
            })
        })
    }, []);
}

function handleChange(e, currClientVal, setFunc) {
    setFunc({ ...currClientVal, [e.target.name]: e.target.value });
}

function HomePage() {
    fetchClientDetails();
    const loadingVal = useRecoilValue(loadingState);
    return <div class="clientspace">
        <ClientList></ClientList>
        <span>{loadingVal}</span>
        {(loadingVal ? <Spinner animation='border'></Spinner> : <ClientDetails></ClientDetails>)}
    </div>
}

function ClientDetails() {
    return <div class="clientdetails">
        <ClientEditables></ClientEditables>
        <GSTDetails></GSTDetails>
        <EmailSendDetails></EmailSendDetails>
        <ClientEmailReceived></ClientEmailReceived>
    </div>
}

export function ClientEditables() {
    const currentClientstate = useRecoilValue(currentClient);

    function updateClient() {
        fetch('http://localhost:3000/clientdetails/' + currentClientstate.gstNumber, {
            method: 'PUT',
            body: JSON.stringify(currentClientstate),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            res.json().then((data) => {
                console.log(data);
            })
        })
            .catch((err) => {
                console.error(err);
            })
    }

    return <div class="editabledetails">
        <IsClientActive></IsClientActive>
        <ClientBasicDetails></ClientBasicDetails>
        <GSTNumber></GSTNumber>
        <GSTPortalDetails></GSTPortalDetails>
        <button class="savebasicdetails" onClick={() => updateClient()} type="submit">Save</button>
    </div>
}

function IsClientActive() {
    const listOfClients = useRecoilValue(clientListState);
    const indexOfClient = useRecoilValue(selectedClientindexState);
    const [currClientVal, setCurrentClient] = useRecoilState(currentClient);

    try {
        const clientactive = listOfClients[indexOfClient].isActive;
        function inactivateClient() {
            setCurrentClient((old) => {
                let __new = { ...old };
                __new.isActive = false;
                console.log(__new);
                return __new;
            });
        }
        function activateClient() {
            setCurrentClient((old) => {
                let __new = { ...old };
                __new.isActive = true;
                console.log(__new);
                return __new;
            });
        }

        if (currClientVal.isActive) {
            return <>
                <label for="clientactive">Active</label>
                <input id="clientactive" onChange={() => inactivateClient()} type="checkbox" checked></input>
            </>
        }
        else {
            return <>
                <label for="clientactive">Active</label>
                <input id="clientactive" onChange={() => activateClient()} type="checkbox"></input >
            </>
        }
    }
    catch (err) {
        return null;
    }
}

function GSTNumber() {
    const listOfClients = useRecoilValue(clientListState);
    const indexOfClient = useRecoilValue(selectedClientindexState);
    try {
        const gstvalue = listOfClients[indexOfClient].gstNumber;
        if (gstvalue == undefined || gstvalue == null) return null;
        else return <div class="gstnumber">
            <text>GST Number: </text>
            <input type="text" value={gstvalue}></input>
        </div>
    }
    catch (err) {
        return null;
    }
}

function ClientEmailReceived() {
    const clientdoc = useRecoilValue(clientdocdetails);

    return <div class="clientemailreceived">
        <div>
            <text>Latest Documents Received on: </text>
            <text>{clientdoc.lastdocdate}</text>
        </div>
        <div>
            <a href="/">Open Documents Folder</a>
        </div>
    </div>
}

function EmailSendDetails() {
    const emaildetails = useRecoilValue(clientemaildetails);

    return <div class="emailsenddetails">
        <div>
            <text>Last Reminder Email Sent on: </text>
            <text>{emaildetails.lastEmail}</text>
        </div>
        <div>
            <text>Next Reminder Email to be sent on: </text>
            <text>{emaildetails.nextEmail}</text>
        </div>
    </div>
}

function GSTPortalDetails() {
    const [currclientval, setCurrClient] = useRecoilState(currentClient);

    try {
        const gstusername = currclientval.gstUsername;
        const gstpassword = currclientval.gstPassword;
        return <div class="gstportaldetails">
            <text>GST Portal Username</text>
            <input name="gstUsername" type="text" value={gstusername} onChange={(e) => handleChange(e, currclientval, setCurrClient)}></input>
            <text>GST Portal Password</text>
            <input name="gstPassword" type="password" value={gstpassword} onChange={(e) => handleChange(e, currclientval, setCurrClient)}></input>
        </div>
    }
    catch (error) {
        return null;
    }
}

function GSTDetails() {
    return <div class="gstdetails">
        <text>GST Filing Due Date: </text>
        <input type="date"></input>
        <button>Fetch Latest</button>
    </div>
}

function ClientBasicDetails() {
    const [currClientVal, setCurrClient] = useRecoilState(currentClient);

    try {
        const clientname = currClientVal.clientName;
        const clientemail = currClientVal.clientEmail;
        const clientnumber = currClientVal.clientNumber;

        // function handleChange(e) {
        //     setCurrClient({ ...currClientVal, [e.target.name]: e.target.value });
        // }

        return <div class="basicdetails">
            <div>
                <text>Client Name:</text>
                <input name="clientName" type="text" value={clientname} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
            <div>
                <text>Client Email:</text>
                <input name="clientEmail" type="text" value={clientemail} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
            <div>
                <text>Client Contact Number:</text>
                <input name="clientNumber" type="text" value={clientnumber} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
        </div>
    }
    catch (err) {
        return null;
    }
}

export function ClientList() {
    const listOfClients = useRecoilValue(clientListState);

    if (listOfClients == undefined || listOfClients.length == 0) {
        return <div class="clientlist">
            <input class="clientsearch" type="text" placeholder='Search for Client'></input>
            <hr class="classlistseparator"></hr>
        </div>
    }

    return <div class="clientlist">
        <input class="clientsearch" type="text" placeholder='Search for Client'></input>
        <hr class="classlistseparator"></hr>
        {listOfClients.map((value, index) => {
            return <ClientItem clientname={value.clientName} clientindex={index}></ClientItem>
        })}
    </div>
}

function ClientItem(props) {
    const setClientIndex = useSetRecoilState(selectedClientindexState);
    const setEmailDetails = useSetRecoilState(clientemaildetails);
    const setDocumentDetails = useSetRecoilState(clientdocdetails);
    const listOfClients = useRecoilValue(clientListState);
    const setCurrentClient = useSetRecoilState(currentClient);
    const setLoadingState = useSetRecoilState(loadingState);

    function selectedClient(clientindex) {
        setClientIndex(clientindex);
        setCurrentClient(listOfClients[clientindex]);
        setLoadingState(true);
        fetch('http://localhost:3000/clientemail/' + listOfClients[clientindex].gstNumber).then((res) => {
            res.json().then((data) => {
                setEmailDetails(data);
            })
                .catch((err) => {
                    setEmailDetails({ lastEmail: '', nextEmail: '' });
                })
        })
            .finally(() => {
                fetch('http://localhost:3000/clientdoc/' + listOfClients[clientindex].gstNumber).then((res) => {
                    res.json().then((data) => {
                        setDocumentDetails(data);
                        console.log(data);
                    })
                        .catch((err) => {
                            setDocumentDetails({ lastdocdate: '', doclocation: '' });
                        });
                })
                    .finally(() => {
                        setLoadingState(false);
                    })
            });
    }

    return <div onClick={() => selectedClient(props.clientindex)} class="clientitem">
        <text>{props.clientname}</text>
        <img src='src/assets/correct.png'></img>
    </div>
}

const loadingState = atom({
    key: 'isLoading',
    default: false
});

const clientListState = atom({
    key: 'clientList',
    default: []
});

const selectedClientindexState = atom({
    key: 'selectedClientindex',
    default: 0
});

const clientemaildetails = atom({
    key: 'clientemaildetails',
    default: {
        lastEmail: '',
        nextEmail: ''
    }
});

const clientdocdetails = atom({
    key: 'docdetails',
    default: { lastdocdate: '', doclocation: '' }
});

const currentClient = atom({
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

export default HomePage;