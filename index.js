require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; 

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`, 
                'Content-Type': 'application/json'
            }
        });
        const records = res.json(response.data);
        console.log(records)
        res.render('homepage', { records: records });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching CRM records');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    try {
        const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', {
            properties: {
                
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`, // Include the API key in the request header
                'Content-Type': 'application/json'
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating a CRM record');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});
