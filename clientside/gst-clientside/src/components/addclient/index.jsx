import { ClientEditables, ClientList } from "../homepage/Index";
import './index.css';

function AddClient() {
    return <div class="addclient">
        <ClientList></ClientList>
        <div class="clientdetails">
            <ClientEditables></ClientEditables>
        </div>
    </div>
}

export default AddClient;