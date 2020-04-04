import React, {
    Component
} from 'react';
import ethLogo from '../assets/ethlogo.png';
import ezerLogo from '../assets/ezerlogo.png';

class SellForm extends Component {

    constructor() {
        super();
        this.state = {
            output: '0'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = e => {
        const value = e.target.value;
        if (value !== '') {
            var tokenAmount = value / 100;
            this.setState({ output: tokenAmount.toString() });
        } else {
            this.setState({ output: '0' });
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const value = this.state.output * 100;
        let tokenAmount = value.toString();
        if (tokenAmount.match(/^[0-9]*$/)) {
            tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether');
            this.props.sellTokens(tokenAmount);
        } else {
            window.alert('Enter valid amount!');
        }
    }

    render() {
        return (
            <div className="flip-card">
                <form className="mb-3" onSubmit={this.handleSubmit}>
                    <div>
                        <label className="float-left"><b>Input</b></label>
                        <span className="float-right text-muted">
                            Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
                        </span>
                    </div>
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="0"
                            onChange={this.handleChange}
                            required />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={ezerLogo} height='32' alt="" />
                    &nbsp;EZER
                  </div>
                        </div>
                    </div>
                    <div>
                        <label className="float-left"><b>Output</b></label>
                        <span className="float-right text-muted">
                            Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
                        </span>
                    </div>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="0"
                            value={this.state.output}
                            disabled
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={ethLogo} height='32' alt="" />
                    &nbsp; ETH
                  </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <span className="float-left text-muted">Exchange Rate</span>
                        <span className="float-right text-muted">1 DApp = 0.01 ETH</span>
                    </div>
                    <button type="submit" className="btn btn-block btn-lg" style={{ background: '#2d3e50', color: '#ffffff' }}>SELL!</button>
                </form>
            </div>
        );
    }
}

export default SellForm;