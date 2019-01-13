const System = require('../src/System');
const chai      = require('chai');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');
const expect    = chai.expect;

chai.use(sinonChai);

describe('System', () => {
    describe('constructor', () => {
        it('should init _frequency, _deltaTime & _entities vars', () => {
            const s = new System();
            expect(s._frequency).to.equal(0);
            expect(s._deltaTime).to.equal(0);
            expect(s._entities).to.be.an('array').that.is.empty;
            const s2 = new System(345);
            expect(s2._frequency).to.equal(345);
        });
    });

    describe('addEntity', () => {
        it('should add an entity to the system', () => {
            const s = new System(100);
            s.postAdd = sinon.spy();
            s.addEntity('kebab');
            expect(s.postAdd).to.have.been.calledWith('kebab');
            expect(s._entities).to.deep.equal(['kebab']);
            s.addEntity('omelette');
            expect(s.postAdd).to.have.been.calledWith('omelette');
            expect(s._entities).to.deep.equal(['kebab', 'omelette']);
        });
    });

    describe('removeEntity', () => {
        it('should remove an entity from the system', () => {
            const s = new System(100);
            s.postRemove = sinon.spy();
            s._entities = ['kebab', 'omelette'];
            s.removeEntity('kebab');
            expect(s.postRemove).to.have.been.calledWith('kebab');
            expect(s._entities).to.deep.equal(['omelette']);
            s.removeEntity('omelette');
            expect(s.postRemove).to.have.been.calledWith('omelette');
            expect(s._entities).to.be.an('array').that.is.empty;
        });
    });

    describe('updateAll', () => {
        it('should update entities if deltaTime > frequency', () => {
            const s = new System(100);
            s.preUpdate = sinon.spy();
            s.postUpdate = sinon.spy();
            s.update = sinon.spy();
            s._entities = ['kebab', 'omelette'];
            s.updateAll(0);
            expect(s.preUpdate).to.not.have.been.called;
            expect(s.postUpdate).to.not.have.been.called;
            expect(s.update).to.not.have.been.called;
            s.updateAll(150);
            expect(s.preUpdate).to.have.been.called;
            expect(s.postUpdate).to.have.been.called;
            expect(s.update).to.have.been.calledWith('kebab');
            expect(s.update).to.have.been.calledWith('omelette');
        });
    });
});
