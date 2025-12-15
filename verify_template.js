const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:2305';

async function runTest() {
    try {
        // 1. Create a template
        console.log('Creating template...');
        const template = {
            name: 'Test Template',
            width: 800,
            height: 600,
            elements: [
                {
                    id: 1,
                    type: 'text',
                    x: 50,
                    y: 50,
                    width: 300,
                    height: 50,
                    content: 'Hello {{name}}!',
                    variableName: 'name',
                    fontSize: 32,
                    color: '#000000'
                },
                {
                    id: 2,
                    type: 'image',
                    x: 50,
                    y: 150,
                    width: 200,
                    height: 200,
                    content: 'https://via.placeholder.com/200',
                    variableName: 'product_image'
                }
            ]
        };

        const createRes = await axios.post(`${BASE_URL}/templates`, template);
        const templateId = createRes.data.id;
        console.log('Template created with ID:', templateId);

        // 2. Render the template
        console.log('Rendering template...');
        const renderRes = await axios.post(`${BASE_URL}/templates/${templateId}/render`, {
            name: 'World',
            product_image: 'https://via.placeholder.com/200/0000FF/808080'
        }, {
            responseType: 'arraybuffer'
        });

        // 3. Save output
        const outputPath = path.join(__dirname, 'test_output.png');
        fs.writeFileSync(outputPath, renderRes.data);
        console.log(`Rendered image saved to ${outputPath}`);

        // 4. Verify file exists and has size
        const stats = fs.statSync(outputPath);
        if (stats.size > 0) {
            console.log('SUCCESS: Image generated successfully.');
        } else {
            console.error('FAILURE: Image is empty.');
        }

    } catch (err) {
        console.error('Test failed:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

runTest();
