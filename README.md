# Palette Picker API
Palette Picker API is a REST API built with Node, Express, and PostgreSQL that hold projects and palettes for [Palette Picker]().

## Database Schema

### Projects
| Parameter    | Data Type |
|:-------------|:----------|
| id           | integer   |
| name         | string    |

### Palettes
| Parameter        | Data Type |
|:-----------------|:----------|
| id               | integer   |
| name             | string    |
| color1           | string    |
| color2           | string    |
| color3           | string    |
| color4           | string    |
| color5           | string    |
| project_id       | integer   |

## Endpoints

#### Base URL: `https://palette-picker-jd.herokuapp.com`

### Projects
* __GET `/api/v1/project`__ returns all projects in the database.

  ```
  [
    {
      "id": 1,
      "name": "my awesome project",
    },
    {
      "id": 2,
      "name": "blue and purples",
    },
    ...
  ]
  ```
  ___
* __POST `/api/v1/project`__ allows for creating new projects.

  Valid request body format:
  ```
  {
    "name": <string>
  }
  ```
* __PATCH `/api/v1/projects/:id`__ allows for editing the name of the project corresponding to the `id` parameter in the request.

  Valid request body format:
  ```
  {
    "name": <string>
  }
  ```
  ___
* __DELETE `/api/v1/projects/:id`__ deletes the project corresponding to the `id` parameter in the request and all associated palettes.

### Palettes
* __GET `/api/v1/palettes`__ returns all palettes in the database.

  ```
  [
    {
      "id": 1,
      "name": "blues and purples",
      "color1": "#5B3FD2",
      "color2": "#41BFCD",
      "color3": "#8B69D3",
      "color4": "#FE7BF0",
      "color5": "#FE7BF0"
      "project_id": "1"
    },
    {
      "id": 2,
      "name": "black on black",
      "color1": "#000000",
      "color2": "#000000",
      "color3": "#000000",
      "color4": "#000000",
      "color5": "#000000"
      "project_id": "1"
    }
  ]
  ```
  ___  
* __POST `/api/v1/palettes`__ allows for creating new palettes.

  Valid request body format:
  ```
  {
    "name": <string>,
    "color1": <string>,
    "color2": <string>,
    "color3": <string>,
    "color4": <string>,
    "color5": <string>,
    "project_id": <integer>
  }
  ```
  ___
* __PATCH `/api/v1/palettes/:id`__ allows for editing the name of the palette corresponding to the `id` parameter in the request.

  Valid request body format:
  ```
  {
    "name": <string>
  }
  ```
  ___
* __DELETE `/api/v1/palettes/:id`__ deletes the palettes corresponding to the `id` parameter in the request.