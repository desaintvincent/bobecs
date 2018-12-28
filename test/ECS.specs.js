import ECS from '../src/ECS';
const chai      = require('chai');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');
const expect    = chai.expect;

chai.use(sinonChai);
describe('ECS', () => {
    describe('createEntity', () => {
        it('should create and add an entity', () => {
            ECS.createEntity();
            expect(ECS.entities().size).to.equal(1);
            ECS.createEntity();
            expect(ECS.entities().size).to.equal(2);
        });
    });

    describe('removeEntity', () => {
        it('should remove an entity', () => {
            ECS.entities().clear();
            expect(ECS.entities().size).to.equal(0);
            const entity = ECS.createEntity();
            expect(ECS.entities().size).to.equal(1);
            ECS.removeEntity(entity);
            expect(ECS.entities().size).to.equal(0);
        });
    });

    describe('addSystem', () => {
        it('should add a system', () => {
            class MySystem {
                construct() {
                    this.prop = 'prop';
                }
            }
            const s = new MySystem();
            expect(ECS.systems().size).to.equal(0);
            ECS.addSystem(s);
            expect(ECS.systems().has('mysystem')).to.equal(true);
            expect(ECS.systems().get('mysystem')).to.equal(s);
        });
    });

    describe('removeSystem', () => {
        it('should remove a system', () => {
            expect(ECS.systems().has('mysystem')).to.equal(true);
            ECS.removeSystem('mysystem');
            expect(ECS.systems().has('mysystem')).to.equal(false);
        });
    });

    describe('hasSystem', () => {
        it('should return if a system exist', () => {
            class MySystem {
                construct() {
                    this.prop = 'prop';
                }
            }
            const s = new MySystem();
            ECS.systems().clear();
            ECS.addSystem(s);
            expect(ECS.hasSystem('mysystem')).to.equal(true);
            expect(ECS.hasSystem('myothersystem')).to.equal(false);
        });
    });

    describe('update', () => {
        it('should update all systems', () => {
            ECS.systems().clear();
            const s = class MySystem { };
            const s2 = class MyOtherSystem { };
            s.updateAll = sinon.spy();
            s2.updateAll = sinon.spy();
            ECS.addSystem(s, 'mysystem');
            ECS.addSystem(s2, 'myothersystem');


            ECS.update(0);
            expect(ECS.system('mysystem').updateAll).to.have.been.calledWith(0);
            expect(ECS.system('myothersystem').updateAll).to.have.been.calledWith(0);
            ECS.update(100);
            expect(ECS.system('mysystem').updateAll).to.have.been.calledWith(100);
            expect(ECS.system('myothersystem').updateAll).to.have.been.calledWith(100);
        });
    });

    describe('addEntityToSystem', () => {
        it('should add an entity to a system', () => {
            ECS.systems().clear();
            const s = class MySystem { };
            s.addEntity = sinon.spy();
            ECS.addSystem(s, 'mysystem');
            ECS.addEntityToSystem('entity', 'mySystem');
            expect(ECS.system('mysystem').addEntity).to.have.been.calledWith('entity');
            expect(() => ECS.addEntityToSystem('entity', 'myOtherSystem')).to.throw(Error);
        });
    });

    describe('removeEntityFromSystem', () => {
        it('should remove an entity from a system', () => {
            ECS.systems().clear();
            const s = class MySystem { };
            s.removeEntity = sinon.spy();
            ECS.addSystem(s, 'mysystem');
            ECS.removeEntityFromSystem('entity', 'mySystem');
            expect(ECS.system('mysystem').removeEntity).to.have.been.calledWith('entity');
            expect(() => ECS.removeEntityFromSystem('entity', 'myOtherSystem')).to.throw();
        });
    });

    describe('removeEntityFromAllSystems', () => {
        it('should remove an entity from all systems', () => {
            ECS.systems().clear();
            const s = class MySystem { };
            const s2 = class MyOtherSystem { };
            s.removeEntity = sinon.spy();
            s2.removeEntity = sinon.spy();
            ECS.addSystem(s, 'mysystem');
            ECS.addSystem(s2, 'myothersystem');

            ECS.removeEntityFromAllSystems('entity');
            expect(ECS.system('mysystem').removeEntity).to.have.been.calledWith('entity');
            expect(ECS.system('myothersystem').removeEntity).to.have.been.calledWith('entity');
        });
    });
});
