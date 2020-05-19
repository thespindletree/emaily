//SurveyForm shows a form for a user to add input

import _ from "lodash";
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    // return a brand new array based on the formFields array using lodash (faster).
    // have to have a "key" properties to make the console error to go away - assigning "name" to it
    // is arbitrary just to make the keys unique
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // ReduxForms will auto match fields named on the errors object to form fields with same name
  // and pass the error string to that field for display along with it
  //   if (!values.title) {
  //     errors.title = "You must provide a title";
  //   }
  //   if (!values.subject) {
  //     errors.subject = "You must provide a subject";
  //   }
  //   if (!values.body) {
  //     errors.title = "You must provide a body";
  //   }
  // Equivalent code below

  _.each(formFields, ({ name }) => {
    errors.recipients = validateEmails(values.recipients || "");

    // Note: 'something.bar' is 'equivalent to 'something['bar']
    //referencing object property 'name' dynamically in the if statement below
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });

  return errors;
  // note: an empty errors object means form field values are valid according to ReduxForms
}

// The ReduxForm helper
// similar to the connect() helper
export default reduxForm({
  validate,
  form: "surveyForm", // 'surveyForm' is a ReduxForm namespace all values all values for this form
  destroyOnUnmount: false, // don't clear the values previously entered on this form when navigating
  // away from this form. This allows user to flick between SurveyForm and SurveyReviewForm without
  // losing form data.
})(SurveyForm);
