import React, { useEffect, useState } from 'react';
import { urlCustomers } from "../endpoints";
import '../Styles/App.css'

export function Customers() {
  interface Customer {
    customerId: number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }

  

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch(urlCustomers)
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  return (
    <>
      <h1>Customer List</h1>
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.customerFirstName}</td>
                <td>{customer.customerLastName}</td>
                <td>{customer.customerEmail}</td>
                <td>{new Date(customer.createdAt).toLocaleString()}</td>
                <td>{new Date(customer.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Customers;