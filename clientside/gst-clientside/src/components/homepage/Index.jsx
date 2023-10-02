import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import './index.css';
import Spinner from 'react-bootstrap/Spinner';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import * as crudAtoms from '../../atoms/atoms.jsx'

export function fetchClientDetails(setClientList, navigate) {
    console.log("fetching client details");
    return fetch("http://localhost:3000/clientlist", {
        method: "GET",
        headers: getHeader()
    }).then((res) => {
        if (res.ok) {
            res.json().then((data) => {
                setClientList(data);
            })
        }
        else {
            navigate('/login');
        }
        console.log("client details fetched");
    })
}

export function handleChange(e, currClientVal, setFunc) {
    setFunc({ ...currClientVal, [e.target.name]: e.target.value });
}

function HomePage() {
    // to set the value of client list
    const [clientList, setClientList] = useRecoilState(crudAtoms.clientListState);
    const setCurrClient = useSetRecoilState(crudAtoms.currentClient);
    const loadingVal = useRecoilValue(crudAtoms.loadingState);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientDetails(setClientList, navigate)
    }, [setClientList, navigate]);

    useEffect(() => {
        if (clientList.length > 0) {
            //setCurrClient(clientList[0]);
        }
    }, []);

    return <div class="clientspace">
        <ClientList></ClientList>
        {(loadingVal ? <span class="spinnerpos">
            <Spinner animation='border'></Spinner>
        </span> : <ClientDetails></ClientDetails>)}
    </div >
}

function ClientDetails() {
    return <div class="clientdetails">
        <ClientEditables gstEditable={false}></ClientEditables>
        <GSTDetails></GSTDetails>
        <EmailSendDetails></EmailSendDetails>
        <ClientEmailReceived></ClientEmailReceived>
    </div>
}

export function ClientEditables({ gstEditable }) {
    const [currentClientstate, setCurr] = useRecoilState(crudAtoms.currentClient);
    const [loadingstate, setLoadingState] = useRecoilState(crudAtoms.loadingState);
    const navigate = useNavigate();
    const [clientList, setClientList] = useRecoilState(crudAtoms.clientListState);

    function updateClient() {
        setLoadingState(true);
        fetch('http://localhost:3000/clientdetails/' + currentClientstate.gstNumber, {
            method: 'PUT',
            body: JSON.stringify(currentClientstate),
            headers: {
                "Content-Type": "application/json",
                "Authorization": getHeader().authorization
            }
        }).then((res) => {
            res.json().then(async (data) => {
                fetchClientDetails(setClientList, navigate);
                await setCurr(data.returnClient);
            })
        })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoadingState(false);
            })
    }

    function saveClient() {
        setLoadingState(true);
        fetch('http://localhost:3000/client/new', {
            method: 'POST',
            body: JSON.stringify(currentClientstate),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getHeader().authorization
            }
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            else {
                console.err(res);
            }
        })
            .then(async (data) => {
                await fetchClientDetails(setClientList, navigate);
                await navigate('/');
                await setCurr(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoadingState(false);
            })
    }

    return <div class="editabledetails">
        <IsClientActive></IsClientActive>
        <ClientBasicDetails></ClientBasicDetails>
        <GSTNumber editable={gstEditable}></GSTNumber>
        <GSTPortalDetails></GSTPortalDetails>
        {(gstEditable) ?
            <button class="savebasicdetails" onClick={() => saveClient()} type="submit">Save</button> :
            <button class="savebasicdetails" onClick={() => updateClient()} type="submit">Update</button>
        }
    </div>
}

function IsClientActive() {
    const [currClientVal, setCurrentClient] = useRecoilState(crudAtoms.currentClient);

    try {
        function inactivateClient() {
            setCurrentClient((old) => {
                let __new = { ...old };
                __new.isActive = false;
                return __new;
            });
        }
        function activateClient() {
            setCurrentClient((old) => {
                let __new = { ...old };
                __new.isActive = true;
                return __new;
            });
        }

        if (currClientVal.isActive) {
            return <>
                <label for="clientactive">Active</label>
                <input id="clientactive" onChange={() => inactivateClient()} type="checkbox" checked={true}></input>
            </>
        }
        else {
            return <>
                <label for="clientactive">Active</label>
                <input id="clientactive" onChange={() => activateClient()} type="checkbox" checked={false}></input >
            </>
        }
    }
    catch (err) {
        return null;
    }
}

function GSTNumber({ editable }) {
    const [currClientVal, setCurrentClient] = useRecoilState(crudAtoms.currentClient);

    try {
        const gstvalue = currClientVal.gstNumber;
        if (gstvalue == undefined || gstvalue == null) return null;
        else {
            if (editable) {
                return <div class="gstnumber">
                    <label>GST Number: </label>
                    <input name="gstNumber" type="text" value={currClientVal.gstNumber} onChange={(e) => handleChange(e, currClientVal, setCurrentClient)}></input>
                </div >
            }
            else {
                return <div class="gstnumber">
                    <label>GST Number: </label>
                    <input type="text" disabled value={gstvalue}></input>
                </div >
            }
        }
    }
    catch (err) {
        return null;
    }
}

function ClientEmailReceived() {
    const clientdoc = useRecoilValue(crudAtoms.clientdocdetails);

    return <div class="clientemailreceived">
        <div>
            <span>Latest Documents Received on: </span>
            <span>{clientdoc.lastdocdate}</span>
        </div>
        <div>
            <a href="/">Open Documents Folder</a>
        </div>
    </div>
}

function EmailSendDetails() {
    const emaildetails = useRecoilValue(crudAtoms.clientemaildetails);

    return <div class="emailsenddetails">
        <div>
            <span>Last Reminder Email Sent on: </span>
            <span>{emaildetails.lastEmail}</span>
        </div>
        <div>
            <span>Next Reminder Email to be sent on: </span>
            <span>{emaildetails.nextEmail}</span>
        </div>
    </div>
}

function GSTPortalDetails() {
    const [currclientval, setCurrClient] = useRecoilState(crudAtoms.currentClient);

    try {
        const gstusername = currclientval.gstUsername;
        const gstpassword = currclientval.gstPassword;
        return <div class="gstportaldetails">
            <label>GST Portal Username</label>
            <input name="gstUsername" type="text" value={gstusername} onChange={(e) => handleChange(e, currclientval, setCurrClient)}></input>
            <label>GST Portal Password</label>
            <input name="gstPassword" type="text" value={gstpassword} onChange={(e) => handleChange(e, currclientval, setCurrClient)}></input>
        </div>
    }
    catch (error) {
        return null;
    }
}

function GSTDetails() {
    return <div class="gstdetails">
        <label>GST Filing Due Date: </label>
        <input type="date"></input>
        <button>Fetch Latest</button>
    </div>
}

function ClientBasicDetails() {
    const [currClientVal, setCurrClient] = useRecoilState(crudAtoms.currentClient);

    try {
        const clientname = currClientVal.clientName;
        const clientemail = currClientVal.clientEmail;
        const clientnumber = currClientVal.clientNumber;

        return <div class="basicdetails">
            <div>
                <label>Client Name:</label>
                <input name="clientName" type="text" value={clientname} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
            <div>
                <label>Client Email:</label>
                <input name="clientEmail" type="text" value={clientemail} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
            <div>
                <label>Client Contact Number:</label>
                <input name="clientNumber" type="text" value={clientnumber} onChange={(e) => handleChange(e, currClientVal, setCurrClient)}></input>
            </div>
        </div>
    }
    catch (err) {
        return null;
    }
}

export function ClientList() {
    const listOfClients = useRecoilValue(crudAtoms.clientListState);
    const [searchString, setSearchString] = useState('');

    if (listOfClients == undefined || listOfClients.length == 0) {
        return <div class="clientlist">
            <input class="clientsearch" type="text" placeholder='Search for Client'></input>
            <hr class="classlistseparator"></hr>
        </div>
    }

    return <div class="clientlist">
        <input class="clientsearch" type="text" placeholder='Search for Client' onChange={(e) => setSearchString(e.target.value)}></input>
        <hr class="classlistseparator"></hr>
        {listOfClients.filter((value) => {
            if (searchString == null || searchString == '') return true;
            else {
                if (value.clientName.toLowerCase().includes(searchString.toLowerCase())) return true;
                else return false;
            }
        }).map((value) => {
            return <ClientItem clientname={value.clientName} clientgst={value.gstNumber}></ClientItem>
        })}
    </div>
}

function ClientItem(props) {
    const setClientIndex = useSetRecoilState(crudAtoms.selectedClientindexState);
    const setEmailDetails = useSetRecoilState(crudAtoms.clientemaildetails);
    const setDocumentDetails = useSetRecoilState(crudAtoms.clientdocdetails);
    const listOfClients = useRecoilValue(crudAtoms.clientListState);
    const setCurrentClient = useSetRecoilState(crudAtoms.currentClient);
    const setLoadingState = useSetRecoilState(crudAtoms.loadingState);
    const navigate = useNavigate();

    function selectedClient(clientgst) {
        navigate('/');
        setClientIndex(listOfClients.findIndex((value) => {
            return value.gstNumber == clientgst
        }));
        setCurrentClient(listOfClients.find((value) => {
            return value.gstNumber == clientgst
        }));
        setLoadingState(true);
        fetch('http://localhost:3000/clientemail/' + clientgst, {
            method: "GET",
            headers: getHeader()
        }).then((res) => {
            res.json().then((data) => {
                setEmailDetails(data);
            })
                .catch((err) => {
                    setEmailDetails({ lastEmail: '', nextEmail: '' });
                })
        })
            .finally(() => {
                fetch('http://localhost:3000/clientdoc/' + clientgst, {
                    method: "GET",
                    headers: getHeader()
                }).then((res) => {
                    res.json().then((data) => {
                        setDocumentDetails(data);
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

    return <div onClick={() => selectedClient(props.clientgst)} class="clientitem">
        <span>{props.clientname}</span>
        <img src='src/assets/correct.png'></img>
    </div>
}

function getHeader() {
    const token = sessionStorage.getItem('token');
    return {
        "authorization": token
    }
}

export default HomePage;