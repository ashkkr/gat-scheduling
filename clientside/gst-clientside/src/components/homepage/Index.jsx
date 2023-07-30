import './index.css';

function HomePage() {
    return <>
        <ClientTable></ClientTable>
    </>
}

function ClientTable(props) {
    return <table class="clienttable">
        <tr>
            <th>Client Id</th>
            <th>Client Name</th>
            <th>Phone Number</th>
        </tr>
        <Clients clientid="1" clientname="Samsung" clientnumber="777"></Clients>
    </table>
}

function Clients(props) {
    return (
        <tr>
            <td>{props.clientid}</td>
            <td>{props.clientname}</td>
            <td>{props.clientnumber}</td>
        </tr>
    )
}

export default HomePage;