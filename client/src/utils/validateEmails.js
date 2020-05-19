const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default (emails) => {
  // split incoming string by comma into array, then return a brand new array with
  // each string having benn trimmed of leading and trailing whitespace
  const invalidEmails = emails
    .split(",")
    .map((email) => email.trim())
    .filter((email) => re.test(email) === false); // we want to capture when filter test fails regex

  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }

  // otherwise just return
  return;
};
