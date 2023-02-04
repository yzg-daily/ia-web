import React, { Component } from 'react';
import { InputNumber } from 'antd';
class RangeNumber extends React.Component {
    constructor(props) {
        super(props);
        let value = props.value;
        if (!value) {
            value = [];
        }
        this.state = {
            value,
        };
    }
    handleBeginChange(value) {
        this.state.value[0] = value;
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    handleEndChange(value) {
        this.state.value[1] = value;
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    render() {
        return (
            <div>
                <InputNumber
                    key='begin_number'
                    value={this.state.value[0]}
                    onChange={this.handleBeginChange.bind(this)}
                />
                ~<InputNumber key='end_number' value={this.state.value[1]} onChange={this.handleEndChange.bind(this)} />
            </div>
        );
    }
}
// RangeNumber.propTypes = {
//   value: PropTypes.array,
//   onChange: PropTypes.func
// };
// RangeNumber.defaultProps = {
//   value: []
// };
export default RangeNumber;
