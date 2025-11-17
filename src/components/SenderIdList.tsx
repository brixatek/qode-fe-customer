import React, { useState, useEffect } from 'react';
import { SenderIdRequest, getStatusLabel, getStatusColor } from '../types/senderIds';
import { adminApi } from '../services/adminApi';

const SenderIdList: React.FC = () => {
  const [senderIds, setSenderIds] = useState<SenderIdRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSenderIds();
  }, []);

  const fetchSenderIds = async () => {
    try {
      // You'll need to add this method to adminApi
      // const response = await adminApi.getSenderIds();
      // setSenderIds(response.data.data);
      
      // For now, using your sample data
      const sampleData: SenderIdRequest = {
        id: "892e24ba-af5f-4244-a044-4d55087c5a79",
        senderId: "MOWA",
        senderIdType: 1,
        useCase: 1,
        sampleMessage: "This is just for test",
        approvalLetterUrl: "https://devnhiastorage.blob.core.windows.net/loki/approval-letters/35c2e0a8-f3ef-4a1b-ba56-4ff0a6be744a/d6984cf8-77d2-4fb4-9129-fb56c2279ec2.png",
        isActive: false,
        status: 2, // This is Approved
        customerId: "35c2e0a8-f3ef-4a1b-ba56-4ff0a6be744a",
        createdAt: "2025-10-25T10:49:49.452309Z",
        createdBy: null
      };
      setSenderIds([sampleData]);
    } catch (error) {
      console.error('Error fetching sender IDs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Sender ID Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Sender ID</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Sample Message</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {senderIds.map((senderId) => (
            <tr key={senderId.id}>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{senderId.senderId}</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                <span 
                  style={{ 
                    color: getStatusColor(senderId.status),
                    fontWeight: 'bold'
                  }}
                >
                  {getStatusLabel(senderId.status)}
                </span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{senderId.sampleMessage}</td>
              <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                {new Date(senderId.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SenderIdList;