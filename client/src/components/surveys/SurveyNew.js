// SurveyNew shows SurveyForm and SurveyFormReview

import React, { Component } from "react";
import { reduxForm } from "redux-form";
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";

class SurveyNew extends Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = { showFormReview: false };
  //   }
  // Equivalent code below due to Create React Apps Babel plugin
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: "surveyForm", // note that navigating away from SurveyNew form will clear down form data
  // as destroyOnUnmount: is defaulted to true here, unlike in SurveyForm
})(SurveyNew);
