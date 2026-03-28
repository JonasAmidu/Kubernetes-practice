import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
`;

const BackButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 10px 20px;
  margin-bottom: 20px;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ProductDetail = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const ProductImage = styled.div`
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
`;

const ProductContent = styled.div`
  padding: 40px;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: #888;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: inline-block;
`;

const ProductName = styled.h1`
  font-size: 32px;
  color: #333;
  margin: 15px 0;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
`;

const ProductMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-top: 30px;
  border-top: 1px solid #eee;
`;

const MetaItem = styled.div`
  & label {
    font-size: 12px;
    color: #888;
    display: block;
    margin-bottom: 5px;
  }
  
  & span {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
  }
  
  & .stock {
    color: ${props => props.low ? '#e74c3c' : '#27ae60'};
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading>Loading product details...</Loading>;
  }

  if (!product) {
    return null;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/products')}>
        ← Back to Products
      </BackButton>
      
      <ProductDetail>
        <ProductImage>📦</ProductImage>
        <ProductContent>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          
          <ProductMeta>
            <MetaItem>
              <label>Price</label>
              <span>${product.price.toFixed(2)}</span>
            </MetaItem>
            
            <MetaItem low={product.stock < 10}>
              <label>Stock</label>
              <span className="stock">{product.stock} units</span>
            </MetaItem>
            
            <MetaItem>
              <label>Created</label>
              <span style={{ fontSize: '14px' }}>
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </MetaItem>
            
            <MetaItem>
              <label>Last Updated</label>
              <span style={{ fontSize: '14px' }}>
                {new Date(product.updatedAt).toLocaleDateString()}
              </span>
            </MetaItem>
          </ProductMeta>
        </ProductContent>
      </ProductDetail>
    </Container>
  );
};

export default ProductDetailPage;
