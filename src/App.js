import { useEffect, useState } from "react";
import "./App.css";
import Layout from "./Components/layout";

function App(data) {
  const [registro, setRegistro] = useState([]);
  const [datos, setDatos] = useState(null);
  const module = data.data.Entity;
  const registerID = data.data.EntityId;

  useEffect(() => {
    window.ZOHO.CRM.UI.Resize({ height: "100%", width: "100%" }).then(function (
      data
    ) {});
    function getRecord(module, registerID) {
      //Get the record info from where you run the widget tool.
      var record = new Promise(function (resolve, reject) {
        window.ZOHO.CRM.API.getRecord({ Entity: module, RecordID: registerID })
          .then(function (e) {
            var register = e.data[0];
            // var numberID = id[0];

            resolve({ register: register });
          })
          .catch(function (error) {
            reject(error);
          });
      });
      return record;
    }
    getRecord(module, registerID)
      .then(function (result) {
        //data del contrato donde estoy
        setRegistro(result.register);
        setDatos(result.register);
        console.log("r ", result);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <Layout
        module={module}
        registerID={registerID}
        registro={registro}
        datos={datos}
      />
    </div>
  );
}

export default App;
