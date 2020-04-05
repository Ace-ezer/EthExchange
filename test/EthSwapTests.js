// Import contracts
const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai').use(require('chai-as-promised')).should();

// Utility function
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}


contract('EthSwap', async ([deployer, investor]) => {

    let token, ethSwap;

    // Initialise Contracts
    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);

        await token.transfer(ethSwap.address, tokens('1000000'));
    })

    describe('Token deployment', async () => {

        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, "DApp Token");
        });
    });

    describe('EthSwap deployment', async () => {

        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, "EthSwap Instant Exchange");
        });

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance, tokens('1000000'));
        });

        describe('Buy tokens', async () => {
            let result;

            // Initialise result of buy tokens transaction
            before(async () => {
                result = await ethSwap.buyTokens({
                    from: investor,
                    value: tokens('1')
                });
            });

            it('Allows users to instantly purchase tokens', async () => {
                // Load balance of the investor
                let investorBalance = await token.balanceOf(investor);
                assert.equal(investorBalance.toString(), tokens('100'));

                // Load remaining token amount
                let ethSwapBalance;
                ethSwapBalance = await token.balanceOf(ethSwap.address);
                assert.equal(ethSwapBalance.toString(), tokens('999900'));

                // Checks for event emitted
                const event = result.logs[0].args;
                assert.equal(event.account, investor);
                assert.equal(event.token, token.address);
                assert.equal(event.amount.toString(), tokens('100').toString());
                assert.equal(event.rate.toString(), '100');
            });
        });

        describe('Sell tokens', async () => {
            let result;

            // Initialise result of sell tokens transaction
            before(async () => {
                await token.approve(ethSwap.address, tokens('100'), { from: investor });
                result = await ethSwap.sellTokens(tokens('100'), { from: investor });
            });

            it('Allows users to instantly sell tokens', async () => {
                // Load balance of the investor
                let investorBalance = await token.balanceOf(investor);
                assert.equal(investorBalance.toString(), tokens('0'));

                // Load remaining token amount
                let ethSwapBalance;
                ethSwapBalance = await token.balanceOf(ethSwap.address);
                assert.equal(ethSwapBalance.toString(), tokens('1000000'));

                // Checks for event emitted
                const event = result.logs[0].args;
                assert.equal(event.account, investor);
                assert.equal(event.token, token.address);
                assert.equal(event.amount.toString(), tokens('100').toString());
                assert.equal(event.rate.toString(), '100');

                // Selling tokens more than present in the account
                await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
            });
        });
    });
});