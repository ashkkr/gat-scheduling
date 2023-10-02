import { fetchClientDetails, ClientEditables, ClientList } from '../homepage/index'
import './index.css';
import * as crudAtoms from "../../atoms/atoms.jsx";
import { useResetRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'

function AddClient() {

    // reset all atom value
    const resetCurrClient = useResetRecoilState(crudAtoms.currentClient);
    const navigate = useNavigate();
    const setClientList = useSetRecoilState(crudAtoms.clientListState);
    const loadingVal = useRecoilValue(crudAtoms.loadingState);

    useEffect(() => {
        (async () => {
            await resetCurrClient();
            fetchClientDetails(setClientList, navigate);
        })();
    }, []);

    return <div class="addclient">
        <ClientList></ClientList>
        <div class="clientdetails">
            {(loadingVal ? <span class="spinnerpos">
                <Spinner animation='border'></Spinner>
            </span> : <ClientEditables gstEditable={true}></ClientEditables>)}
        </div>
    </div>
}

export default AddClient;