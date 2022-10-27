import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Image, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';

const SignIn = () => {

  const useAccount = () => useTracker(() => {
    const currentUser = Meteor.user();
    const userId = Meteor.userId();
    return {
      currentUser,
      userId,
      isLoggedIn: !!userId,
    };
  }, []);

  const { isLoggedIn } = useAccount();

  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(isLoggedIn);

  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    // console.log('submit2', email, password, error, redirect);
  };

  if (redirect) {
    return (<Navigate to="/home" />);
  }
  // Otherwise return the Login form.
  return (
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={6}>
          <Image src="/images/leftPane.png" width="100%" />
        </Col>

        <Col xs={6} className="d-flex flex-column justify-content-center">

          <h2>Login to RV2EZ</h2>

          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card style={{ border: 'none' }}>
              <Card.Body>
                <TextField label="" id="signin-form-email" name="email" labelClassName="" placeholder="e-mail" style={{ border: 'none' }} />
                <TextField label="" id="signin-form-password" name="password" placeholder="Password" type="password" />
                <ErrorsField />
                <SubmitField id="signin-form-submit" className="$orange-500" />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="light">
            <Link to="/signup">Click here to Register</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
