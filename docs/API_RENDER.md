# Direct JSON Render API

## Endpoint
```
POST /templates/render
```

## Description
Renders an image directly from template JSON without saving it to the database. Perfect for one-time renders or dynamic template generation.

## Request Body
```json
{
  "template": {
    "width": 1080,
    "height": 1920,
    "elements": [
      {
        "id": "text1",
        "type": "text",
        "x": 100,
        "y": 100,
        "width": 880,
        "height": 100,
        "content": "Hello {{name}}!",
        "variableName": "name",
        "fontSize": 48,
        "color": "#ffffff"
      },
      {
        "id": "img1",
        "type": "image",
        "x": 100,
        "y": 250,
        "width": 880,
        "height": 880,
        "content": "{{imageUrl}}",
        "variableName": "imageUrl",
        "fit": "cover"
      }
    ]
  },
  "data": {
    "name": "World",
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

## Response
- **Content-Type**: `image/png`
- **Body**: PNG image buffer

## Example Usage

### cURL
```bash
curl -X POST "http://localhost:2305/templates/render" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "width": 1080,
      "height": 1920,
      "elements": [
        {
          "id": "1",
          "type": "text",
          "x": 100,
          "y": 100,
          "width": 880,
          "height": 100,
          "content": "Hello {{name}}!",
          "variableName": "name",
          "fontSize": 48,
          "color": "#000000"
        }
      ]
    },
    "data": {
      "name": "World"
    }
  }' \
  --output result.png
```

### JavaScript (fetch)
```javascript
const response = await fetch('http://localhost:2305/templates/render', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template: {
      width: 1080,
      height: 1920,
      elements: [
        {
          id: '1',
          type: 'text',
          x: 100,
          y: 100,
          width: 880,
          height: 100,
          content: 'Hello {{name}}!',
          variableName: 'name',
          fontSize: 48,
          color: '#000000'
        }
      ]
    },
    data: {
      name: 'World'
    }
  })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Use url for <img src="...">
```

### Python (requests)
```python
import requests

response = requests.post(
    'http://localhost:2305/templates/render',
    json={
        'template': {
            'width': 1080,
            'height': 1920,
            'elements': [
                {
                    'id': '1',
                    'type': 'text',
                    'x': 100,
                    'y': 100,
                    'width': 880,
                    'height': 100,
                    'content': 'Hello {{name}}!',
                    'variableName': 'name',
                    'fontSize': 48,
                    'color': '#000000'
                }
            ]
        },
        'data': {
            'name': 'World'
        }
    }
)

with open('result.png', 'wb') as f:
    f.write(response.content)
```

## Differences from `/templates/:id/render`

| Feature | `/templates/:id/render` | `/templates/render` |
|---------|------------------------|---------------------|
| Template Storage | Required (saved in DB) | Not required (ephemeral) |
| Template ID | Required in URL | Not needed |
| Request Body | Only `data` variables | Full `template` + `data` |
| Use Case | Reusable templates | One-time/dynamic renders |

## Error Responses

### Missing Template
```json
{
  "error": "Template JSON is required in request body"
}
```
**Status**: 400

### Invalid Template
```json
{
  "error": "Template must have width and height properties"
}
```
**Status**: 400
