import React from 'react';
import './Calculator.scss';
import ItemPrice from './price/ItemPrice';
import EmployeeList from './employee/EmployeeList';

const Calculator = ({ layout }) => {

    return(
        <div className="calculator-container">
            <ItemPrice layout={layout}></ItemPrice>
            <EmployeeList layout={layout}></EmployeeList>
        </div>
    );
}

export default Calculator;