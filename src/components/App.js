import React, {
  Component
} from 'react';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';
import Loader from '../assets/loading.gif';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      tokenBalance: '0',
      ethBalance: '0',
      loading: true
    }
  }

  async componentDidMount() {
    const accounts = await window.web3.eth.getAccounts();

    // Checks whether the account has been changed
    var accountInterval = setInterval(function () {
      window.web3.eth.getAccounts()
        .then(account => {
          if (accounts[0] !== account[0]) {
            window.location.reload();
          }
        });
    }, 100);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });

    // Load Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const address = tokenData.address;
      const token = new web3.eth.Contract(Token.abi, address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      if (tokenBalance)
        this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert("Token contract not deployed to detected network.");
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const address = ethSwapData.address;
      const ethSwap = new web3.eth.Contract(EthSwap.abi, address);
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert("Non-Ethereum browser detected");
    }
  }

  buyTokens = (ethAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens()
      .send({ value: ethAmount, from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      })
      .on('error', err => {
        window.alert('Not enough Ether!');
        this.setState({ loading: false });
      });;
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });

    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount)
      .send({ from: this.state.account })
      .on('transactionHash', hash => {

        this.state.ethSwap.methods.sellTokens(tokenAmount)
          .send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.setState({ loading: false });
            window.location.reload();
          })
          .on('error', err => {
            window.alert('Not enough DApps!');
            this.setState({ loading: false });
          });
      });
  }

  render() {
    let content = this.state.loading ? (
      <p className="text-center">
        <img src={Loader} alt="Loading..." style={{ height: '100px', width: '100px' }} />
      </p>) : (
        <Main
          account={this.state.account}
          tokenBalance={this.state.tokenBalance}
          ethBalance={this.state.ethBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid" style={{ marginTop: '120px' }}>
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="!#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;