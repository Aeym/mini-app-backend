# Mini App Backend - Technical Test

This is the backend application built using NestJS and TypeORM for managing nurseries and children within those nurseries. It integrates various modules such as authentication, email services, and child/nursery management, providing a RESTful API for the frontend.

## Application Overview
This backend service provides an API for managing nurseries, children, and user authentication. Key functionalities include:
1. User Authentication

    Users can register and log in using a username and email.
    The API handles user creation and validation of unique usernames.

2. Nursery Management

    The API allows creating, updating, listing, and deleting nurseries.
    Nurseries are associated with users, ensuring only authorized users can modify or delete them.
    When a nursery is deleted, all associated children are unassigned, and other users who added children to the nursery are notified by email.

3. Child Management

    The API manages children’s assignments to nurseries.
    Users can create or remove children and assign them to nurseries.
    It ensures no duplicate children are assigned to the same nursery.

4. CSV Export of Child Data

    The API provides an endpoint to export child data in CSV format, either for all nurseries or a specific nursery.
    The data is streamed to handle large datasets efficiently, avoiding memory overload.
    The CSV is ordered by children’s last names (A > Z).

## Installation

To set up the project locally, follow these steps:

1. **Create the database**:

Install mysql-server
```bash
sudo apt update
sudo apt install mysql-server
```

Start server
```bash
sudo systemctl start mysql
```

Connect
```bash
sudo mysql -u root -p
```

Create database
```bash
CREATE DATABASE nest_app;
```

Create user
```bash
CREATE USER 'nestuser'@'localhost' IDENTIFIED BY 'nest_password';
GRANT ALL PRIVILEGES ON nest_app.* TO 'nestuser'@'localhost';
FLUSH PRIVILEGES;
```

2. **Clone the repository**:

```bash
git clone https://github.com/aeym/mini-app-backend.git
cd mini-app-backend
```

3. **Install dependencies**: Make sure you have Node.js installed, then run:

```bash
npm install
```

4. **Serve the application**:

```bash
npm run start
```

5. **Access the API**:

The API will be available at:

```bash
http://localhost:3000/
```

## Testing

Currently, the backend includes a comprehensive test suite covering controllers, services, and repositories. Use the following command to run the tests:

```bash
npm run test
```

## Future Improvements

Future improvements will include more thorough error handling, advanced input validation, additional security measures, performance optimizations (optimizing how relationships between entities are handled, such as fetching only the necessary fields rather than entire related entities to reduce payload size and improve response times), and more robust tests. Also, ensuring better adherence to Clean Code, KISS, YAGNI, and DRY principles.

## Contact

If you have any questions regarding this implementation, feel free to contact me at alrick.eymauzy@gmail.com or via GitHub.
