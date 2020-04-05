import React, {
    Component
} from 'react';
import ReactCardFlip from 'react-card-flip';
import './Main.css';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

class Main extends Component {

    constructor() {
        super();
        this.state = {
            isFlipped: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    // Handles card flip of the forms
    handleClick = (e) => {
        //e.preventDefault();
        //this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
        if (e.target.value === "buy") {
            this.setState({ isFlipped: false });
        } else {
            this.setState({ isFlipped: true });
        }
    }

    render() {
        return (
            <div id='content'>
                <div className="switcher">
                    <p className="fieldset">
                        <input type="radio" name="button" value="buy" id="buy" onClick={this.handleClick} />
                        <label htmlFor="buy">Buy</label>
                        <input type="radio" name="button" value="sell" id="sell" onClick={this.handleClick} />
                        <label htmlFor="sell">Sell</label>
                        <span className="switch"></span>
                    </p>
                </div>
                <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
                    <BuyForm
                        tokenBalance={this.props.tokenBalance}
                        ethBalance={this.props.ethBalance}
                        buyTokens={this.props.buyTokens}
                    />
                    <SellForm
                        tokenBalance={this.props.tokenBalance}
                        ethBalance={this.props.ethBalance}
                        sellTokens={this.props.sellTokens}
                    />
                </ReactCardFlip>
            </div>
        );
    }
}

export default Main;