## Identity Reconciliation Service Endpoint

This document explains how to use the identity reconciliation service's main function.


### **`POST /identify`**

This function takes customer contact details and figures out if they belong to an existing customer or a new one. It then links all related contact information together.

#### **What to Send (Request)**

Send your request as **JSON**. Make sure the `Content-Type` header is set to `application/json`.

```json
{
  "email": "string",
  "phoneNumber": "string"
}
```

  * **Note:** You must provide at least an **email** or a **phoneNumber**.

#### **What You Get Back (Response)**

If successful, you'll receive a `200 OK` status with a **JSON** body:

```json
{
  "contact": {
    "primaryContatctId": "number",
    "emails": ["string"],          
    "phoneNumbers": ["string"],    
    "secondaryContactIds": ["number"] 
  }
}
```

  * **`primaryContatctId`**: The ID of the main customer profile.
  * **`emails`**: All unique email addresses linked to this customer, with the primary contact's email first.
  * **`phoneNumbers`**: All unique phone numbers linked to this customer, with the primary contact's phone number first.
  * **`secondaryContactIds`**: A list of IDs for all linked contact entries that are not the primary one.

#### **How to Use It (Example)**

Here's an example using `curl` to send a request:

```bash
curl --location 'https://identityreconciliationservice.onrender.com/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
}'
```

-----

### **Live Service Location**

You can access the live service at:

**`https://identityreconciliationservice.onrender.com/identify`**

-----