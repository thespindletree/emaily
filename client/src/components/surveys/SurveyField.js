// SurveyField contains logic to render a single label and text input

import React from "react";

// This component is wrapped by Field tag (redux-form) so huge bunch of props are
// available as result in props. In case below destructurised to just get "input" from props
// Note: {...input} means assign across all properties/event handling functions already
// inside "input" and attach them to the input tag. So "onChange" to named field you get automatically.
// meta contains errors if present
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: "5px" }} />
      <div className="red-text" style={{ marginBottom: "20px" }}>
        {touched && error}
      </div>
    </div>
  );
};
