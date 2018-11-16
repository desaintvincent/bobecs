import ECS from './../src/ECS';
const chai      = require('chai');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');
const expect    = chai.expect;

chai.use(sinonChai);
describe('ECS', () => {
    describe('createEntity', () => {
        it('should create and add an entity', () => {
            ECS.createEntity();
            expect(ECS._entities.length).to.equal(1);
            ECS.createEntity();
            expect(ECS._entities.length).to.equal(2);
        });
    });

    describe('removeEntity', () => {
        it('should remove an entity', () => {
            ECS._entities = [];
            expect(ECS._entities.length).to.equal(0);
            const entity = ECS.createEntity();
            expect(ECS._entities.length).to.equal(1);
            ECS.removeEntity(entity);
            expect(ECS._entities.length).to.equal(0);
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
            expect(ECS._systems).to.be.empty;
            ECS.addSystem(s);
            expect(ECS._systems).to.have.a.property('mysystem');
            expect(ECS._systems['mysystem']).to.equal(s);
        });
    });

    describe('removeSystem', () => {
        it('should remove a system', () => {
            expect(ECS._systems).to.have.a.property('mysystem');
            ECS.removeSystem('mysystem');
            expect(ECS._systems).to.not.have.a.property('mysystem');
        });
    });

    describe('hasSystem', () => {
        it('should return if a system exist', () => {
            ECS._systems = {
                mysystem: {}
            };
            expect(ECS.hasSystem('mysystem')).to.equal(true);
            expect(ECS.hasSystem('myothersystem')).to.equal(false);
        });
    });

    describe('update', () => {
        it('should update all systems', () => {
            ECS._systems = {
                mysystem: {
                    updateAll: sinon.spy()
                },
                myothersystem: {
                    updateAll: sinon.spy()
                }
            };
            ECS.update(0);
            expect(ECS._systems.mysystem.updateAll).to.have.been.calledWith(0);
            expect(ECS._systems.myothersystem.updateAll).to.have.been.calledWith(0);
            ECS.update(100);
            expect(ECS._systems.mysystem.updateAll).to.have.been.calledWith(100);
            expect(ECS._systems.myothersystem.updateAll).to.have.been.calledWith(100);
        });
    });

    describe('addEntityToSystem', () => {
        it('should add an entity to a system', () => {
            ECS._systems = {
                mysystem: {
                    addEntity: sinon.spy()
                }
            };
            ECS.addEntityToSystem('entity', 'mySystem');
            expect(ECS._systems.mysystem.addEntity).to.have.been.calledWith('entity');
            expect(() => ECS.addEntityToSystem('entity', 'myOtherSystem')).to.throw(Error);
        });
    });

    describe('removeEntityFromSystem', () => {
        it('should remove an entity from a system', () => {
            ECS._systems = {
                mysystem: {
                    removeEntity: sinon.spy()
                }
            };
            ECS.removeEntityFromSystem('entity', 'mySystem');
            expect(ECS._systems.mysystem.removeEntity).to.have.been.calledWith('entity');
            expect(() => ECS.removeEntityFromSystem('entity', 'myOtherSystem')).to.throw();
        });
    });

    describe('removeEntityFromAllSystems', () => {
        it('should remove an entity from all systems', () => {
            ECS._systems = {
                mysystem: {
                    removeEntity: sinon.spy()
                },
                myothersystem: {
                    removeEntity: sinon.spy()
                }
            };
            ECS.removeEntityFromAllSystems('entity');
            expect(ECS._systems.mysystem.removeEntity).to.have.been.calledWith('entity');
            expect(ECS._systems.myothersystem.removeEntity).to.have.been.calledWith('entity');
        });
    });
});
