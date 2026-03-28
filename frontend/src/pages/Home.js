import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hero = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #666;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 40px 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 40px;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const FeatureDesc = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Home = () => {
  return (
    <>
      <Hero>
        <Title>Modern Microservices Architecture</Title>
        <Subtitle>
          A complete full-stack application built with React, Node.js, Express, Docker, and Kubernetes.
          Scale your applications with confidence.
        </Subtitle>
        <ButtonGroup>
          <Button to="/products" className="primary">Explore Products</Button>
          <Button to="/register" className="secondary">Get Started</Button>
        </ButtonGroup>
      </Hero>
      
      <Features>
        <FeatureCard>
          <FeatureIcon>⚛️</FeatureIcon>
          <FeatureTitle>React Frontend</FeatureTitle>
          <FeatureDesc>Modern React with hooks, styled-components, and responsive design</FeatureDesc>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🔌</FeatureIcon>
          <FeatureTitle>REST API</FeatureTitle>
          <FeatureDesc>Express.js microservices with proper error handling and validation</FeatureDesc>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🐳</FeatureIcon>
          <FeatureTitle>Docker Ready</FeatureTitle>
          <FeatureDesc>Containerized services with health checks and graceful shutdown</FeatureDesc>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>☸️</FeatureIcon>
          <FeatureTitle>Kubernetes</FeatureTitle>
          <FeatureDesc>Full K8s manifests with deployments, services, ingress, and config</FeatureDesc>
        </FeatureCard>
      </Features>
    </>
  );
};

export default Home;
