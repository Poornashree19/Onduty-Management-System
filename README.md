#  On-Duty Management System

A web-based application to streamline and automate the student on-duty (OD) request and approval process. Designed for educational institutions to reduce paperwork and save time for students, teachers, and HODs.

##  Features

-  Submit on-duty requests online
-  Role-based login (Student, Faculty, HOD)
-  Authentication with JWT 
-  Faculty review and approval system
-  HOD-level final approval
-  Date and reason tracking
-  Status update (Pending, Approved, Rejected)
-  Clean and responsive UI

##  Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB


##  How It Works

1. **Student** fills out an OD form online and submits it.
2. **Faculty** receives the request, reviews it, and either approves or rejects.
3. **HOD** performs the final approval.
4. Status is updated in real time and can be tracked by the student.

##  Installation & Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/onduty-management-system.git
   cd onduty-management-system

2. **Install backend dependencies**

   ```bash
      Copy
      Edit
      npm install
   Configure environment variables

3. **Create a .env file**
   
     Add your MongoDB URI and other configs

4. **Run the server**

    ```bash
      Copy
      Edit
      node server/server.js
      Open client/index.html in browser
      (Or serve with any static file server)


