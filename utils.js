// {
//     "contact":{
//         "primaryContatctId": 11,
//         "emails": ["george@hillvalley.edu","biffsucks@hillvalley.edu"]
//         "phoneNumbers": ["919191","717171"]
//         "secondaryContactIds": [27]
//     }
// }

const responseFormat = (arr) => {
  const primary = arr.filter((elm) => elm.linkPrecedence === "primary");
  const secondary = arr.filter((elm) => elm.linkPrecedence === "secondary");

  const response = {
    contact: {
      primaryContactId: primary[0].id,
      emails: [...secondary.map((elm) => elm.email)],
      phoneNumbers: [...secondary.map((elm) => elm.phoneNumber)],
      secondaryContactIds: [...secondary.map((elm) => elm.id)],
    },
  };

  if (primary[0].email) response.contact.emails.unshift(primary[0].email);
  if (primary[0].phoneNumber)response.contact.phoneNumbers.unshift(primary[0].phoneNumber);
  
  response.contact.emails = [...new Set(response.contact.emails)].filter(Boolean);
  response.contact.phoneNumbers = [...new Set(response.contact.phoneNumbers)].filter(Boolean);
  
  return response;
};

const getAllPrimary = (arr)=>{
    const primary = arr.filter(elm => elm.linkPrecedence==="primary");
    return primary;
  }

module.exports = {
  responseFormat,
  getAllPrimary
};
