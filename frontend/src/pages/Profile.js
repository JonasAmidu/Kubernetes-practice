import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
`;

const InfoGroup = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 12px;
  color: #888;
  display: block;
  margin-bottom: 5px;
`;

const Value = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const Button = styled.button`
  width: 100%;
  background: #e74c3c;
  color: white;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 30px;
  
  &:hover {
    background: #c0392b;
  }
`;

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Title>My Profile</Title>
      
      <ProfileCard>
        <Avatar>👤</Avatar>
        
        <InfoGroup>
          <Label>Full Name</Label>
          <Value>{user.name}</Value>
        </InfoGroup>
        
        <InfoGroup>
          <Label>Email Address</Label>
          <Value>{user.email}</Value>
        </InfoGroup>
        
        <InfoGroup>
          <Label>Member Since</Label>
          <Value>{new Date(user.createdAt).toLocaleDateString()}</Value>
        </InfoGroup>
        
        <Button onClick={handleLogout}>Logout</Button>
      </ProfileCard>
    </Container>
  );
};

export default Profile;
