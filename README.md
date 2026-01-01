# 🤖 AI Invoice Generator API

An AI-powered backend API that analyze your invoice.
Based on generates AI Insights, on based on text or bill description parsed the text
and create an professional Invoice, and also invoice specific reminder maill 

## 🚀 Overview

The **AI Invoice Generator API** processes with invoices descriptions mainly count on pain and unpaid
invoices
generate:\
- AI Insights\
- AI Invoice\
- AI Reminder Mail\

All insights are powered by **Google Gemini**, and User Data are stored in
**MongoDB** for retrieval & filtering.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Node.js**
-   **Express.js**
-   **MongoDB + Mongoose**
-   **Google Gemini API** (AI resume analysis)

------------------------------------------------------------------------

## 📌 Features

-   AI Powered Dashboad Summary\
-   AI-powered Invoice Generation\
-   AI-Powered Follow Up mail\
-   Create Normal Invoice as per data\
-   Fetch user authorized Invoice\
-   Password Encrypted\

------------------------------------------------------------------------

## 📂 Project Structure

    /project-root
    │── /routes
    │── /config
    │── /controllers
    │── /middlewares
    │── /models
    │── server.js
    │── README.md

------------------------------------------------------------------------

## 🧠 AI Processing Workflow

1.  AI Invoice Generatiom:

    -   **User provide the client name** (text)
    -   **User provide the client email** (text)
    -   **User provide the client address** (text)
    -   **User provide the all product name** (text)
    -   **along with unit price** (text)

2.  Backend sends all to **Google Gemini**

3.  Gemini extracts:

    -   Client **Name**
    -   Client **email Id**
    -   Client **addres*
    -   **Items and unite price** (object Array)
    -   **Fit Score (0--10)**

4.  Based on Invoice status, API assigns:

    -   **Insights**
    -   **Suggest required action**
    -   **Weak match**



------------------------------------------------------------------------

# 📡 API Endpoints

## 1️⃣ AI Insights

### GET /api/ai/dashboard-summary

#### Response:

``` json
{
  {"insights":["It's encouraging to see INR 13,000 in revenue successfully collected from your recent invoices!","You have a substantial INR 78,900 outstanding across 3 invoices. Prioritizing proactive follow-ups, especially for the large Invoice #INV-003, can significantly boost your cash flow.","With 3 out of 4 invoices currently pending, implementing a consistent reminder system could help reduce your outstanding balance and ensure quicker payments going forward."]}
}
```

------------------------------------------------------------------------


# 📡 API Endpoints

## 2️⃣ AI Invoice

### POST /api/ai/parse-text

#### Body (form-Data):
  ---------------- ------------ ----------------------
  text                text         Invoice details 
  Invoice for Innocation Corp Inc (constract@example.com). Items include: 15 hours of web development consulting at 120/hr, a new logo design for 950, and a website hosting fee for 50. Their address is 123 Tech Park, Kolkata, WB.

#### Response:

``` json
{"ClientName":"Innocation Corp Inc","email":"constract@example.com","address":"123 Tech Park, Kolkata, WB","items":[{"name":"web development consulting","quantity":15,"unitPrice":120},{"name":"logo design","quantity":1,"unitPrice":950},{"name":"website hosting fee","quantity":1,"unitPrice":50}]}
```

------------------------------------------------------------------------

## 3️⃣ Fetch All Invoices

### GET /api/invoices

Returns all analyzed candidates stored in MongoDB.

------------------------------------------------------------------------

## 3️⃣ Delete Invoice by Id

### DELETE /api/invoices/:id

#### Query Parameters (optional):

  Param      Type     Description
  ---------- -------- --------------------------
  invoice Id   string   given mongodb
  

#### Example:

    DELETE /api/invoices/693ea78ac24da14fcd2c4bbe

------------------------------------------------------------------------

## 4️⃣ Fetch Invoice by Id

### GET /api/invoices/:id

#### Query Parameters (optional):

  Param      Type     Description
  ---------- -------- --------------------------
  invoice Id   string   given mongodb
  

#### Example:

    GET /api/invoices/693ea78ac24da14fcd2c4bbe

------------------------------------------------------------------------

## 5️⃣ Register User

### POST /api/auth/register

#### Body (form-data):

  Fields     Type     Description
  ---------- -------- --------------------------
    name      string    User Name
    email     string    User email Id
  password    string    password with minimun length 6
  

#### Example:

    http://localhost:5000/api/auth/register

##### We endpoint for User=: 
   ### Update User:     PUT /api/auth/me
   ### Login User:      POST /api/auth/login
   ### Login User:      POST /api/auth/login
   ### Get User Info :  GET /api/auth/login

------------------------------------------------------------------------

# 🗄️ MongoDB Schema (Mongoose)

``` js
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        businessName: { type: String, default: ''},
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
    },
    { timestamps: true }
);

```

``` js
const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
    taxPercent: {type: Number, default: 0},
    total: { type: Number, required: true},
});

const invoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
        },
        invoiceDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
        },
        billFrom: {
            businessName: String,
            email: String,
            address: String,
            phone: String,
        },
        billTo: {
            clientName: String,
            email: String,
            address: String,
            phone: String,
        },
        items: [itemSchema],
        notes: {
            type: String,
        },
        paymentTerms: {
            type: String,
            default: "Net 15",
        },
        status: {
            type: String,
            enum: ["Paid", "Unpaid"],
            default: "Unpaid",
        },
        subtotal: Number,
        taxTotal: Number,
        total: Number,
    },
    { timestamps: true}
);

    
```

------------------------------------------------------------------------

# 🏁 Running the Project

### 1. Install dependencies

``` bash
npm install
```

### 2. Add environment variables

Create a `.env` file:

    MONGO_URI=your_mongodb_string
    GEMINI_API_KEY=your_api_key
    PORT=5000

### 3. Start server

``` bash
npm run dev
```

------------------------------------------------------------------------

# 📌 Example Client Request (curl)

``` bash
curl -X POST http://localhost:5000/api/invoices   
```

------------------------------------------------------------------------

# ⭐ Contribute

Pull requests are welcome!