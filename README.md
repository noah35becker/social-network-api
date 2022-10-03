# Social Network API
[![License: GNU LGPLv3](https://img.shields.io/badge/License-GNU%20LGPLv3-informational.svg)](https://choosealicense.com/licenses/lgpl-3.0)

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
    

## Repo
[https://github.com/noah35becker/social-network-api](https://github.com/noah35becker/social-network-api)


## Description
This API uses MongoDB / Mongoose to manage a mock social network database. The database includes data for `User`s, `Thought`s, and `Reaction`s (more details [below](#usage)).


## Video walkthrough
[https://www.youtube.com/watch?v=LE4tUzdftvU](https://www.youtube.com/watch?v=LE4tUzdftvU)


<i><b>
## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Directions for future development](#directions-for-future-development)
- [Credits](#credits)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)
</i></b>


## Installation
1. You must have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed in order to use this API.
2. Navigate to this project's [GitHub repo](https://github.com/noah35becker/social-network-api/)
2. Click the green "Code" button, then click "Download ZIP"
3. Unzip the downloaded folder
4. Rename the unzipped folder if you want, and move it wherever you'd like on your drive
5. Open the terminal, `cd` to the program folder you just downloaded, and then run the command `npm install`
6. Once `npm install` finishes running, you're all set!


## Usage
If you haven't already, open the terminal and `cd` to the program folder you downloaded during [installation](#installation). Then run the command `npm start` to turn on the server and activate all API routes. (When running locally, they're located at `http://localhost:3001/`.)

The API exposes these routes:
- <b>`/api/users`</b>
    - `GET`: All `User`s
    - `POST`: Create a new `User` (the body of the request expects `{username, email}`)
- <b>`/api/users/:id`</b>
    - `GET`: One `User`
    - `PUT`: Update a `User`'s `username` and/or `email`
    - `DELETE`: Delete a `User` (also deletes all their `Thought`s, and removes them from all other `User`s' friends lists)
- <b>`/api/users/:userId/friends/:friendId`</b>
    - `POST`: Mutually add the two `User`s to each other's friends lists
    - `DELETE`: Mutually remove the two `User`s from each other's friends lists
- <b>`/api/thoughts/`</b>
    - `GET`: All `Thought`s
    - `POST`: Create a new `Thought` (the body of the request expects `{user (ObjectID), thoughtText}`)
- <b>`/api/thoughts/:id`</b>
    - `GET`: One `Thought`
    - `PUT`: Update a `Thought`'s `thoughtText`
    - `DELETE`: Delete a `Thought` (and all its `Reaction`s)
- <b>`/api/:thoughtId/reactions`</b>
    - `POST`: Add a `Reaction` to a `Thought` (the body of the request expects `{user (ObjectID), reactionBody}`)
- <b>`/api/:thoughtId/reactions/:reactionId`</b>
    - `DELETE`: Delete a `Reaction` from a `Thought`


## Directions for future development
- The URLs of API calls could include <ins>sort queries</ins> for various parameters, e.g. sorting `Thought`s by `reactionCount` or by `createdAt`, sorting `User`s by `friendCount`, etc.
- When a `User` is deleted, so are their associated `Thought`s. They're also removed from all other `User`s' friends lists. However, their `Reaction`s are left behind as artifacts in the database, now with a `user._id` of `null`. <ins>When a `User` is deleted, their `Reaction`s should also be purged from the database.</ins>



## Credits

### Creator
Noah Becker ([GitHub](https://github.com/noah35becker))


### Third-party assets
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- Node packages:
    - [Express](https://www.npmjs.com/package/express)
    - [Mongoose](https://www.npmjs.com/package/mongoose)
    - [Luxon](https://www.npmjs.com/package/luxon)




## License

[![License: GNU LGPLv3](https://img.shields.io/badge/License-GNU%20LGPLv3-informational.svg)](https://choosealicense.com/licenses/lgpl-3.0)

Learn more about this license [here](https://choosealicense.com/licenses/lgpl-3.0).






## Contributing
Feel free to fork this project's [repo](https://github.com/noah35becker/social-network-api), contribute code, and submit pull requests [here](https://github.com/noah35becker/social-network-api/pulls)!

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)

Contributors to this project must follow all guidelines set forth by the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).






## Questions
My GitHub username is [noah35becker](https://github.com/noah35becker).

If you have any questions, I'd be glad to hear from you—contact me at [noahbeckercoding@gmail.com](mailto:noahbeckercoding@gmail.com).
