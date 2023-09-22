const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var clientid = 1;

const ClientSchema = new mongoose.Schema({
    clientId: Number,
    clientName: String,
    clientEmail: String,
    clientNumber: String,
    gstNumber: String,
    gstUsername: String,
    gstPassword: String,
    isActive: Boolean,
    isDeleted: Boolean
},
    { collection: 'clientmaster' });

const EmailSchema = new mongoose.Schema({
    clientId: Number,
    lastEmail: [{ type: String }],
    nextEmail: String
}, {
    collection: 'clientEmailDetails'
});

const DocumentSchema = new mongoose.Schema({
    clientId: Number,
    docReceived: [{ type: String }],
    docLocation: String
}, {
    collection: 'documentMaster'
});

const ClientsModel = mongoose.model('clientmaster', ClientSchema);
const EmailModel = mongoose.model('emailmaster', EmailSchema);
const DocModel = mongoose.model('docmaster', DocumentSchema);

router.get('/hello', (req, res) => {
    res.send("hey this also works");
});

router.post('/client/new', async (req, res) => {
    var newClient = {
        clientId: generateClientId(),
        ...req.body,
        isActive: true,
        isDeleted: false
    };
    console.log(req.body);
    console.log(newClient);
    const newClientModel = new ClientsModel(newClient);
    await newClientModel.save();
    res.json(newClient);
});

router.get('/clientlist', async (req, res) => {
    const listOfClients = await ClientsModel.find({});
    res.json(listOfClients);
});

router.get('/clientemail/:gst', async (req, res) => {
    const clientDetails = await ClientsModel.findOne({ gstNumber: req.params.gst });

    try {
        const clientEmailDetails = await EmailModel.findOne({ clientId: clientDetails.clientId });
        const returnemaildetails = {
            lastEmail: clientEmailDetails.lastEmail.slice(-1)[0],
            nextEmail: clientEmailDetails.nextEmail
        }

        res.json(returnemaildetails);
    }
    catch (err) {
        res.status(404).json({ message: "no client email details found" });
    }
});

router.get('/clientdoc/:gst', async (req, res) => {
    const clientDetails = await ClientsModel.findOne({ gstNumber: req.params.gst });

    try {
        const clientdocdetails = await DocModel.findOne({ clientId: clientDetails.clientId });

        const docresult = {
            lastdocdate: clientdocdetails.docReceived.slice(-1)[0],
            doclocation: clientdocdetails.docLocation
        }

        res.json(docresult);
    }
    catch (err) {
        res.status(404).json({ message: "client document details not found" });
    }
});

router.post('/clientemail/:gst', async (req, res) => {
    const clientDetails = await ClientsModel.findOne({ gstNumber: req.params.gst });
    const clientEmailDetails = await EmailModel.findOne({ clientId: clientDetails.clientId });

    if (clientEmailDetails == null) {
        const newEntry = {
            clientId: clientDetails.clientId,
            lastEmail: [req.body.emaildate],
            nextEmail: req.body.nextemaildate
        }
        const newmodel = new EmailModel(newEntry);
        await newmodel.save();
        res.json({ message: "new document creatd" });
    }
    else {
        clientEmailDetails.lastEmail.push(req.body.emaildate);
        clientEmailDetails.nextEmail = req.body.nextemaildate;

        await clientEmailDetails.save();

        res.json({ message: "document updated" });
    }
});

router.put('/clientdetails/:gst', async (req, res) => {
    try {
        const newclientdetails = req.body;
        const returnClient = await ClientsModel.findOneAndUpdate({ gstNumber: req.params.gst }, newclientdetails, { new: true });
        res.json({ message: "client updated successfully", returnClient: returnClient, payload: req.body });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});

function generateClientId() {
    clientid++;
    return clientid;
}

module.exports = router;