import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';

import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Stuffs } from '../../api/stuff/Stuff';

const MySwal = withReactContent(Swal);

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  quantity: Number,
  condition: {
    type: String,
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddStuff = () => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    Stuffs.collection.insert(
      { name, quantity, condition, owner },
      (error) => {

        if (error) {
          // MySwal.fire('Error', error.message, 'error');
        } else {
          MySwal.fire({
            title: <p>Hello World</p>,
            footer: 'Copyright 2018',
            onOpen: () => {
              // `MySwal` is a subclass of `Swal`
              //   with all the same instance & static methods
              setTimeout(() => MySwal.clickConfirm(), 2500);
            },
          }).then(() => MySwal.fire(<p>Shorthand works too</p>));
          formRef.reset();
        }
      },
    );
  };

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: 'top-right',
  //   iconColor: 'white',
  //   customClass: {
  //     popup: 'colored-toast',
  //   },
  //   showConfirmButton: false,
  //   timer: 1500,
  //   timerProgressBar: true,
  // });

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add RV</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField name="name" />
                <NumField name="quantity" decimal={null} />
                <SelectField name="condition" />
                <SubmitField value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddStuff;
