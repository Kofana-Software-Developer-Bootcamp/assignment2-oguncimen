import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  FloatingLabel,
  ButtonGroup,
} from "react-bootstrap";
function App() {
  const [intA, setIntA] = useState(0);
  const [intB, setIntB] = useState(0);
  const [operation, setOperation] = useState("Add");
  const [result, setResult] = useState(0);

  const calculate = () => {
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

    fetch(
      "http://localhost:8000/http://www.dneonline.com/calculator.asmx",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(result, "text/xml");
        var x = xmlDoc.getElementsByTagName(`${operation}Result`)[0]
          .childNodes[0].nodeValue;
        setResult(x);
      })
      .catch((error) => console.log("error", error));
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
                  }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Number two">
                <Form.Control
                  type="number"
                  placeholder="Enter number two"
                  onChange={(value) => {
                    setIntB(value.target.value);
                  }}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Select operator">
                <Form.Select
                  aria-label="Default select example"
                  onChange={({ target }) => {
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
                type="button"
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
