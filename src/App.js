import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import { Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
function App() {
  const [intA, setIntA] = useState(0);
  const [intB, setIntB] = useState(0);
  const [operation, setOperation] = useState("Add");
  const [result, setResult] = useState(0);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  //set the form values for errors
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const calculate = (e) => {
    //stop the form from submitting
    e.preventDefault();
    // get our new errors
    const newErrors = findFormErrors();
    // Conditional logic:
    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      // No errors!
      setErrors({});
      // Do the calculation
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/xml; charset=utf-8");
      myHeaders.append("SOAPAction", `http://tempuri.org/${operation}`);
      var raw = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>\n    <${operation} xmlns="http://tempuri.org/">
            <intA>${intA}</intA>
            <intB>${intB}</intB>
            </${operation}> 
            </soap:Body></soap:Envelope>`;

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      //send request to server
      fetch(
        "http://localhost:8080/http://www.dneonline.com/calculator.asmx",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          //parse the result
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(result, "text/xml");
          //get the result
          var x = xmlDoc.getElementsByTagName(`${operation}Result`)[0]
            .childNodes[0].nodeValue;
          //set the result
          setResult(x);
        })
        .catch((error) => console.log("error", error));
    }
  };
  // Finds errors in the form
  const findFormErrors = () => {
    const { number1, number2 } = form;
    // Create an empty errors object
    const newErrors = {};
    // Check if the number1 is not a number or empty
    if (!number1 || number1 === "") newErrors.number1 = "Required!";
    // food errors
    if (!number2 || number2 === "") newErrors.number2 = "Required!";
    // rating errors
    return newErrors;
  };
  return (
    <div className="App">
      <div className="formContainer">
        <Form>
          <Row>
            <Col>
              <FloatingLabel label="Number one">
                <Form.Control
                  type="number"
                  placeholder="Enter number one"
                  onChange={(value) => {
                    setIntA(value.target.value);
                    setField("number1", value.target.value);
                  }}
                />
              </FloatingLabel>
              <Form.Label className="errorLabels">{errors.number1}</Form.Label>
            </Col>
            <Col>
              <FloatingLabel label="Number two">
                <Form.Control
                  type="number"
                  placeholder="Enter number two"
                  onChange={(value) => {
                    //set the value
                    setIntB(value.target.value);
                    //set the field for errors
                    setField("number2", value.target.value);
                  }}
                />
              </FloatingLabel>
              <Form.Label className="errorLabels">{errors.number2}</Form.Label>
            </Col>
            <Col>
              <FloatingLabel label="Select operation">
                <Form.Select
                  aria-label="Default select example"
                  //destructuring
                  onChange={({ target }) => {
                    //set the operation
                    setOperation(target.value);
                  }}
                >
                  <option value="Add">Add</option>
                  <option value="Divide">Divide</option>
                  <option value="Multiply">Multiply</option>
                  <option value="Subtract">Subtract</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <Button
                size="lg"
                variant="primary"
                onClick={calculate}
                className="calculateButton"
              >
                Calculate
              </Button>
            </Col>
            <Col>
              <FloatingLabel label="Result">
                <Form.Control
                  className="result"
                  type="number"
                  placeholder="Result"
                  value={result}
                  readOnly
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default App;
