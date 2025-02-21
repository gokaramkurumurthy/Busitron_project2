import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Alert,
} from 'react-bootstrap';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Oauth from './Oauth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthForm({ onClose }) { 
  const naviget = useNavigate();
  const [isRegister, setIsRegister] = useState();
  const [error, setError] = useState(''); // Error state

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/user/register',
          form,
        );
        const data = response.data;

        if (data.success) {
          setForm({
            username: '',
            email: '',
            password: '',
          });
          naviget('/admin');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/user/login',
          form,
        );
        const data = response.data;
        if (data.success) {
          setForm({
            email: '',
            password: '',
          });
          naviget('/admin');
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '90vh' }} // Ensures form centers in modal
    >
      <Card className="p-4" style={{ borderRadius: '20px', maxWidth: '600px' }}>
        <Card.Body>
          <Row>
            <Col className="text-center">
              <p className="h1 fw-bold mb-3">
                {isRegister ? 'Sign up' : 'Login'}
              </p>
              <p className="text-secondary mb-4">
                {isRegister ? 'Sign up' : 'Login'} with <Oauth />
              </p>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmitHandler} style={{ width: '100%' }}>
                {isRegister && (
                  <div className="mb-3">
                    <TextField
                      label="Your Name"
                      variant="outlined"
                      fullWidth
                      name="username"
                      value={form.username}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <TextField
                    label="Your Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={form.email}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div className="mb-3">
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="password"
                    value={form.password}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="mb-3"
                  size="lg"
                  style={{ width: '100%' }}
                >
                  {isRegister ? 'Register' : 'Login'}
                </Button>
              </Form>

              <p className="text-center">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button variant="link" onClick={toggleForm}>
                  {isRegister ? 'Login' : 'Sign up'}
                </Button>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuthForm;
