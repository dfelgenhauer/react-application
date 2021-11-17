import './App.css';
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import { Dropdown, Input, Grid, Button, Form, Select, Container, Segment, Divider, Pagination} from 'semantic-ui-react'
import { getOptions, getMetrics, getMeasures, getTimeOptions, getOperatorOptions } from './Utility';
import 'react-datez/dist/css/react-datez.css';
import { ReactDatez } from 'react-datez'
import { toKeyAlias } from '@babel/types';


function App() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [restaurantIds, setRestaurantIds] = useState([]);
  const [fromHour, setFromHour] = useState(6);
  const [toHour, setToHour] = useState(29);
  const [criteria, setCriteria] = useState([{ metricCode: "", compareType : "", value: 0, operatorType: "And" }]);
  const [totalResults, setTotalResults] = useState([]);
  const [resultsOnPage, setResultsOnPage] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [formUrl, setFormUrl] = useState("");
  const [resultsUrl, setResultsUrl] = useState("");
  const numberOfItemsOnPage = 20

let handleChange = (index, data) => {
    let newCriteria = [...criteria];
    if (data.name === "value") {
        if (data.value === '') {
            newCriteria[index][data.name] = '';
        }
        else {
            newCriteria[index][data.name] = parseInt(data.value);
        }
    }
    else {
        newCriteria[index][data.name] = data.value;
    }
    setCriteria(newCriteria);
    fixDate()
}

let addCriteria = () => {
    setCriteria([...criteria, { metricCode: "", compareType : "", value: 0, operatorType: "" }])
}

let removeCriteria = (i) => {
    let newCriteria = [...criteria];
    newCriteria.splice(i, 1);
    setCriteria(newCriteria)
}

let onSubmit = () => {
    userPush()
}

let onSubmitForm = () => {
    urlPush()
}

let fixDate = () => {
        var temp = startDate
        var tempr = endDate
    if (temp.length > 19) {
        for (var i=0;i<6;i++) {
            temp = temp.slice(0, -1)
            tempr = tempr.slice(0, -1)
        }
        setStartDate(temp)
        setEndDate(tempr)
    }
}

let createData = () => {
    const initialFormData = {
        restaurantIds: restaurantIds,
        fromDate: startDate,
        toDate: endDate,
        fromHour: fromHour,
        toHour: toHour,
        metricCriteria: criteria
    };
    const totalResultss = JSON.stringify(initialFormData)
    setResultsUrl(totalResultss)
    return totalResultss
}

let pageResultsCreator = (newPage) => {
    var startNum = ((newPage - 1) * numberOfItemsOnPage)
    var lengthNum = totalResults.length -1
    var endNum = (newPage * numberOfItemsOnPage) - 1
    var realEndNumber = Math.min(lengthNum, endNum)
    var resultsList = []
    for (var i=0;i<=realEndNumber;i++) {
        if (i >= startNum) {
            resultsList.push(totalResults[i])
        }
    }
    setResultsOnPage(resultsList)
}

const onChange = (index, pageInfo) => {
    setActivePage(pageInfo.activePage);
    pageResultsCreator(pageInfo.activePage);
};

let timeFix = (data) => {
    let x = data.substring(11,16)
    return x
}

let dateFix = (data) => {
    let x = data.substring(0,10)
    return x
}

const userPush = async () => {
    let xxx = createData()
    const response = await fetch('https://customsearchqueryapi.azurewebsites.net/Search/Query', {
      method: 'POST',
      body: xxx, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let temp = await response.json() //extract JSON from the http response
    let tempr = []
    for (var i=0;i<temp.length;i++) {
        tempr.push(temp[i])
    }
    setTotalResults(tempr)
  }

const urlPush = async () => {
    let xxx = formUrl
    const response = await fetch('https://customsearchqueryapi.azurewebsites.net/Search/Query', {
      method: 'POST',
      body: xxx, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let result = await response.json()
    let tempr = []
    for (var i=0;i<result.length;i++) {
        tempr.push(result[i])
    }
    setResultsUrl(formUrl)
    setTotalResults(tempr)
}

useEffect(() => {
    pageResultsCreator(1)
}, [totalResults]);


  return (
    <div className="App">
            <Grid>
                <Grid.Row>
                    <Container>
                        <Segment className="Segment">
                            <Grid centered>
                                <Grid.Row columns="1">
                                    <Grid.Column textAlign="center">
                                        <h3>Custom Search Query Tool</h3>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns="1">
                                <Grid.Column textAlign="center">
                                        <h4>Search with preset data</h4>
                                </Grid.Column>
                                    <Grid.Column>
                                        <Form onSubmit={() => onSubmitForm()}>
                                            <Form.Field
                                                name="Form Data"
                                                control={Input}
                                                label={"Form Data"}
                                                placeholder='Form Data'
                                                onChange={(event, data) => setFormUrl(data.value)}
                                                value={formUrl}
                                            />
                                            <Form.Field>
                                                <Button color="olive" type="submit">
                                                    Submit
                                                </Button>
                                            </Form.Field>
                                        </Form>
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                        <h4>Or</h4>
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                        <h4>Search with selected parameters</h4>
                                </Grid.Column>
                                    <Grid.Column>
                                        <Form onSubmit={() => onSubmit()} >
                                            <Form.Field>
                                                <label style={{fontWeight: "bold"}}>Restaurant Id</label>
                                                <Dropdown
                                                    options={getOptions}
                                                    placeholder={"Select Restaurant Id"}
                                                    multiple
                                                    selection
                                                    onChange={(event, data) => setRestaurantIds(data.value)}
                                                    value={restaurantIds}
                                                />
                                            </Form.Field>
                                            <Form.Group>
                                                <Form.Field
                                                    control={Select}
                                                    label={"Transaction Time Start"}
                                                    options={getTimeOptions}
                                                    value={fromHour}
                                                    onChange={(event, data) => setFromHour(data.value)}
                                                />
                                                <Form.Field
                                                    control={Select}
                                                    label={"Transaction Time End"}
                                                    options={getTimeOptions}
                                                    value={toHour}
                                                    onChange={(event, data) => setToHour(data.value)}
                                                />
                                                <Form.Field>
                                                <label htmlFor="exampleDate2">Start Date</label>
                                                <ReactDatez
                                                    name="dateInput"
                                                    startDate="01/01/2000"
                                                    endDate= {new Date()}
                                                    handleChange={value => {
                                                    setStartDate(value);
                                                    }}
                                                    value={startDate}
                                                    allowPast= { true }
                                                    dateFormat= "MM/DD/YYYY"
                                                />
                                                </Form.Field>
                                                <Form.Field>
                                                <label htmlFor="exampleDate2">End Date</label>
                                                <ReactDatez
                                                    name="dateInput"
                                                    startDate="01/01/2000"
                                                    endDate= {new Date()}
                                                    handleChange={value => {
                                                    setEndDate(value);
                                                    }}
                                                    value={endDate}
                                                    allowPast= { true }
                                                    dateFormat= "MM/DD/YYYY"
                                                />
                                                </Form.Field>
                                            </Form.Group>
                                            {criteria.map((crit, index) => (
                                                    <Form.Group>
                                                        <Form.Field
                                                            name="metricCode"
                                                            control={Select}
                                                            options={getMetrics}
                                                            label={"Metric to Measure by"}
                                                            placeholder='Choose Metric'
                                                            value={crit.metricCode}
                                                            onChange={(event, data) => handleChange(index, data)}
                                                        />
                                                        <Form.Field
                                                            name="compareType"
                                                            control={Select}
                                                            label={"Measure"}
                                                            options={getMeasures}
                                                            placeholder='Measure'
                                                            onChange={(event, data) => handleChange(index, data)}
                                                            value={crit.compareType}
                                                        />
                                                        <Form.Field
                                                            name="value"
                                                            control={Input}
                                                            label={"Value"}
                                                            placeholder='Value'
                                                            onChange={(event, data) => handleChange(index, data)}
                                                            value={crit.value}
                                                        />
                                                        <Form.Field
                                                            name="operatorType"
                                                            control={Select}
                                                            label={"Operator"}
                                                            options={getOperatorOptions}
                                                            placeholder='Operator Options'
                                                            onChange={(event, data) => handleChange(index, data)}
                                                            value={crit.operatorType}
                                                        />
                                                        <Form.Field>
                                                            {
                                                                index ?
                                                                <Button onClick={() => removeCriteria(index)}  color="red">Remove</Button>
                                                                : null
                                                            }
                                                        </Form.Field>
                                                    </Form.Group>
                                                ))}
                                            <Form.Group>
                                                <Form.Field>
                                                    <Button className='ui button' onClick={() => addCriteria()} color="violet">Add Criteria</Button>
                                                </Form.Field>
                                            </Form.Group>
                                            <Form.Field>
                                                <Button color="olive" type="submit">
                                                    Submit
                                                </Button>
                                            </Form.Field>
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Container>
                </Grid.Row>
                <Divider hidden></Divider>
                <Grid.Row>
                    <Container>
                        <Segment>
                            <h3>
                                Results
                                <Pagination className="Pagentation" activePage={activePage} onPageChange={onChange} totalPages={Math.ceil((totalResults.length)/20)} ellipsisItem={null}/>
                                <h4>
                                    Data parameters for results: {resultsUrl}
                                </h4>
                            </h3>
                                <table class="ui celled table">
                                    <thead>
                                        <tr>
                                        <th>Order Number</th>
                                        <th>Resturant ID</th>
                                        <th>Date</th>
                                        <th>Net Amount</th>
                                        <th>Total Amount</th>
                                        <th>Items Sold</th>
                                        <th>Beverage Quantity</th>
                                        <th>Discount Amount</th>
                                        <th>Discount Ratio</th>
                                        <th>Deleted Items</th>
                                        <th>Order Time</th>
                                        <th>Refund Amount</th>
                                </tr></thead>
                                    {resultsOnPage.map((criti, index) => (
                                            <tbody>
                                                <tr>
                                                <td data-label="Order Number">{resultsOnPage[index].orderNumber}</td>
                                                <td data-label="Resturant ID">{resultsOnPage[index].restaurantId}</td>
                                                <td data-label="Date">{dateFix(resultsOnPage[index].busDt)}</td>
                                                <td data-label="Net Amount">{"$" + resultsOnPage[index].netAmount.toFixed(2)}</td>
                                                <td data-label="Total Amount">{"$" + resultsOnPage[index].totalAmount.toFixed(2)}</td>
                                                <td data-label="Items Sold">{resultsOnPage[index].itemSoldQty}</td>
                                                <td data-label="Beverage Quantity">{resultsOnPage[index].beverageQty}</td>
                                                <td data-label="Discount Amount">{"$" + resultsOnPage[index].discountAmount.toFixed(2)}</td>
                                                <td data-label="Discount Ratio">{(resultsOnPage[index].discountRatio * 100).toFixed(2) + "%"}</td>
                                                <td data-label="Deleted Items">{resultsOnPage[index].itemDeletedAmount}</td>
                                                <td data-label="order Time">{timeFix(resultsOnPage[index].orderTime)}</td>
                                                <td data-label="Refund Amount">{"$" + resultsOnPage[index].refundAmount.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                    ))}
                                </table>
                        </Segment>
                    </Container>
                </Grid.Row>
            </Grid>
        </div>
  );
}

export default App;
