import './App.css';
import 'semantic-ui-css/semantic.min.css'
import React, { useState } from 'react'
import { Dropdown, Input, Grid, Button, Form, Select, Container, Segment, Divider } from 'semantic-ui-react'
import { getOptions, getMetrics, getMeasures, getTimeOptions, getOperatorOptions } from './Utility';
import 'react-datez/dist/css/react-datez.css';
import { ReactDatez } from 'react-datez'


function App() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [restaurantIds, setRestaurantIds] = useState([]);
  const [fromHour, setFromHour] = useState(6);
  const [toHour, setToHour] = useState(29);
  const [metrics, setMetrics] = useState(null);
  const [measures, setMeasures] = useState(null);
  const [val, setVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [criteria, setCriteria] = useState([{ metrics: "", measures : "", value: "", operator: "" }])

  let handleChange = (i, e) => {
    let newCriteria = [...criteria];
    newCriteria[i][e.target.name] = e.target.value;
    setCriteria(newCriteria);
  }

let addCriteria = () => {
    setCriteria([...criteria, { metrics: "", measures : "", value: "", operator: "" }])
  }

let removeCriteria = (i) => {
    let newCriteria = [...criteria];
    newCriteria.splice(i, 1);
    setCriteria(newCriteria)
}

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
                                    <Grid.Column>
                                        <Form /* onSubmit={() => onSubmit()} */>
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
                                                            control={Select}
                                                            options={getMetrics}
                                                            label={"Metric to Measure by"}
                                                            placeholder='Choose Metric'
                                                            onChange={(event, data) => setMetrics(data.metrics)}
                                                            value={metrics}
                                                        />
                                                        <Form.Field
                                                            control={Select}
                                                            label={"Measure"}
                                                            options={getMeasures}
                                                            placeholder='Measure'
                                                            onChange={(event, data) => setMeasures(data.measures)}
                                                            value={measures}
                                                        />
                                                        <Form.Field
                                                            control={Input}
                                                            label={"Value"}
                                                            placeholder='Value'
                                                            onChange={(event, data) => setVal(data.val)}
                                                            value={val}
                                                        />
                                                        <Form.Field
                                                            control={Select}
                                                            label={"Operator"}
                                                            options={getOperatorOptions}
                                                            placeholder='Operator Options'
                                                            onChange={(event, data) => setOperator(data.operator)}
                                                            value={operator}
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
                            <h3>Results</h3>
                        </Segment>
                    </Container>
                </Grid.Row>
            </Grid>
        </div>
  );
}

export default App;
