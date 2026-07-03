import React, { useEffect, useState } from 'react';
import { fetchCustomers } from '../services/customerService';
import { useToastStore } from '../store/toastStore';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Props {
  accountId?: string;
}

const CustomerList: React.FC<Props> = ({ accountId }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const toast = useToastStore();

  const loadCustomers = async () => {
    if (!accountId || !accountId.trim()) {
      console.warn('[CustomerList] Invalid account id');
      return;
    }

    try {
      const response = await fetchCustomers(accountId);

      if (!response || !response.data) {
        console.warn('[CustomerList] Empty customer response');
        toast.showToast('error', 'Error', 'Unable to load customers.');
        return;
      }

      setCustomers(response.data);
    } catch (error) {
      console.error('[CustomerList] Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [accountId]);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div>
      <h2>Customers</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
