import './index.css';

function HomePage() {
    return <div class="clientspace">
        <ClientList></ClientList>
        <ClientDetails></ClientDetails>
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
    return <div class="editabledetails">
        <label for="clientactive">Active</label>
        <input id="clientactive" type="checkbox"></input>
        <ClientBasicDetails></ClientBasicDetails>
        <GSTNumber></GSTNumber>
        <GSTPortalDetails></GSTPortalDetails>
        <button class="savebasicdetails" type="submit">Save</button>
    </div>
}

function GSTNumber() {
    return <div class="gstnumber">
        <text>GST Number: </text>
        <input type="text"></input>
    </div>
}

function ClientEmailReceived() {
    return <div class="clientemailreceived">
        <div>
            <text>Latest Documents Received on: </text>
            <text>26 July, 2023</text>
        </div>
        <div>
            <a href="/">Open Documents Folder</a>
        </div>
    </div>
}

function EmailSendDetails() {
    return <div class="emailsenddetails">
        <div>
            <text>Last Reminder Email Sent on: </text>
            <text>26 July, 2023</text>
        </div>
        <div>
            <text>Next Reminder Email to be sent on: </text>
            <input type="date"></input>
        </div>
    </div>
}

function GSTPortalDetails() {
    return <div class="gstportaldetails">
        <text>GST Portal Username</text>
        <input type="text"></input>
        <text>GST Portal Password</text>
        <input type="password"></input>
    </div>
}

function GSTDetails() {
    return <div class="gstdetails">
        <text>GST Filing Due Date: </text>
        <input type="date"></input>
        <button>Fetch Latest</button>
    </div>
}

function ClientBasicDetails() {
    return <div class="basicdetails">
        <div>
            <text>Client Name:</text>
            <input type="text"></input>
        </div>
        <div>
            <text>Client Email:</text>
            <input type="text"></input>
        </div>
        <div>
            <text>Client Contact Number:</text>
            <input type="text"></input>
        </div>
    </div>
}

export function ClientList() {
    return <div class="clientlist">
        <input class="clientsearch" type="text" placeholder='Search for Client'></input>
        <hr class="classlistseparator"></hr>
        <ClientItem clientname="Samsons"></ClientItem>
        <ClientItem clientname="DAV School"></ClientItem>
        <ClientItem clientname="Lakshya Coaching Centre"></ClientItem>
        <ClientItem clientname="Aggarsain School"></ClientItem>
        <ClientItem clientname="Wisdom School"></ClientItem>
    </div>
}

function ClientItem(props) {
    return <div class="clientitem">
        <text>{props.clientname}</text>
        <img src='src/assets/correct.png'></img>
    </div>
}

export default HomePage;