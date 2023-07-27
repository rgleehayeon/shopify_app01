import React from "react";
// import React, { useState } from "react";
// import { render, TextField } from "@shopify/checkout-ui-extensions-react";

import {
  render,
  TextField,
  useApplyMetafieldsChange,
  useBuyerJourneyIntercept,
  useMetafield,
} from "@shopify/checkout-ui-extensions-react";
import { useState } from "react";
render('Checkout::Dynamic::Render', () => <App />);

// function App() {
//   const {extensionPoint} = useExtensionApi();
//   const translate = useTranslate();
//   return (
//     <Banner title="aaaaaaa">
//       {translate('text', {extensionPoint})}
//     </Banner>
//   );
// }

// const residentIdState = useMetafield({
//   namespace: METAFIELD_NAMESPACE,
//   key: METAFIELD_KEY,
// });

function App() {
  const METAFIELD_NAMESPACE = "RESIDENT_ID_APP";
  const METAFIELD_KEY = "resident_id";

  const [error, setError] = useState(false);
  const updateMetafield = useApplyMetafieldsChange();
  // const [residentID, setResidentID] = useState("");
  const residentIdState = useMetafield({
    namespace: METAFIELD_NAMESPACE,
    key: METAFIELD_KEY,
  });

  // const handleFieldChange = (value) => {
  //   setResidentID(value);
  // };

  useBuyerJourneyIntercept(() => {
    if (!validateResidentId(residentIdState.value)) {
      return {
        behavior: "block",
        reason: "Form is not valid!!!!!",
        // if a partner tries block checkout, then `perform()` does not get called and nothing happens
        // acts like `behavior: allow`
        perform: () => showValidationUI(),
      };
    } else {
      setError(false);
      return {
        behavior: "allow",
      };
    }
  });

  const showValidationUI = () => {
    console.log("validation UI");
    setError(true);
  };

  const handleFieldChange = (value) => {
    if (error) {
      let validId = validateResidentId(value);
      if (validId) {
        setError(false);
      }
    }
    updateMetafield({
      type: "updateMetafield",
      namespace: METAFIELD_NAMESPACE,
      key: METAFIELD_KEY,
      valueType: "string",
      value: value,
    });
  };

  const validateResidentId = (value) => {
    return value.length === 9;
  };

  return (
    <TextField
      label="Resident ID"
      value={residentIdState?.value}
      error={error ? "Please provide a valid ID!!!" : false}
      onChange={handleFieldChange}
    />
  );

  // return (
  //   <TextField
  //     label="resident ID"
  //     value={residentID}
  //     error={error ? "Please provide a valid ID" : false}
  //     onChange={handleFieldChange}
  //   />
  // );

}